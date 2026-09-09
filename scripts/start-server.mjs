import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const mode = process.argv[2] === "start" ? "start" : "dev";
const extraArgs = process.argv.slice(3);
const vinextCli = path.join(root, "node_modules", "vinext", "dist", "cli.js");
const refreshScript = path.join(root, "scripts", "run-showcase-refresh.ps1");
const devLockPath = path.join(root, ".vinext", "dev", "lock.json");

const hasExplicitHost = extraArgs.some((argument) =>
  argument === "--host" || argument.startsWith("--host="),
);

function startShowcaseRefresh() {
  const refresh = spawn(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", refreshScript, "-SyncOnly"],
    {
      cwd: root,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    },
  );
  refresh.unref();
  console.log("Actualizarea tuturor proiectelor a pornit în fundal.");
}

async function readRunningDevServer() {
  if (mode !== "dev") return null;

  try {
    const lock = JSON.parse(fs.readFileSync(devLockPath, "utf8"));
    if (!Number.isInteger(lock.pid) || lock.pid <= 0 || !Number.isInteger(lock.port)) return null;
    process.kill(lock.pid, 0);

    // A live PID is not enough: Vinext can leave its process alive while the
    // Worker runner has failed before the HTTP listener is ready.
    const response = await fetch(`http://127.0.0.1:${lock.port}/`, {
      signal: AbortSignal.timeout(1500),
    });
    if (response) return lock;
  } catch {
    // Fall through and clear a stale lock below.
  }

  try {
    fs.unlinkSync(devLockPath);
    console.log("A fost eliminat lock-ul unui server dev indisponibil.");
  } catch {
    // The lock may already have been removed by Vinext.
  }
  return null;
}

const runningDevServer = await readRunningDevServer();
if (runningDevServer) {
  // `localhost` may resolve to an unrelated IPv6 listener on Windows. The
  // vinext server binds IPv4, so always print an address that reaches it.
  console.log(`Site-ul rulează deja la http://127.0.0.1:${runningDevServer.port}`);
  process.exit(0);
}

function portIsAvailable(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.unref();
    probe.once("error", () => resolve(false));
    probe.listen({ host: "127.0.0.1", port }, () =>
      probe.close(() => resolve(true)),
    );
  });
}

async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port <= 65535; port += 1) {
    if (await portIsAvailable(port)) return port;
  }
  throw new Error(`Nu a fost găsit niciun port liber începând cu ${startPort}.`);
}

// Pornim de la 3000, dar alegem întotdeauna primul port liber pentru a permite
// rularea simultană a mai multor proiecte fără coliziuni.
const selectedPort = await findAvailablePort(3000);
// Bind by default to every network interface so `npm run dev` is available
// from a phone on the same private network. `--host` can still override this.
const hostArgs = hasExplicitHost ? [] : ["--host", "0.0.0.0"];
const serverArgs = [vinextCli, mode, "--port", String(selectedPort), ...hostArgs, ...extraArgs];

if (selectedPort) {
  console.log(selectedPort === 3000
    ? "Pornire pe http://127.0.0.1:3000"
    : `Portul 3000 este ocupat. Pornire automată pe http://127.0.0.1:${selectedPort}`);
}

// Serverul principal primește prioritate și păstrează terminalul în prim-plan.
const server = spawn(process.execPath, serverArgs, {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

server.once("error", (error) => {
  console.error(`Serverul principal nu a putut porni: ${error.message}`);
  process.exitCode = 1;
});

// Lansăm proiectele secundare separat, după ce serverul principal a început pornirea.
// Avoid rewriting public/ while Vite builds the development module graph.
// Refresh static showcases explicitly with `npm run showcase:refresh`.
const refreshTimer = mode === "start"
  ? setTimeout(startShowcaseRefresh, 1500)
  : null;

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    if (!server.killed) server.kill(signal);
  });
}

server.once("exit", (code, signal) => {
  if (refreshTimer) clearTimeout(refreshTimer);
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
