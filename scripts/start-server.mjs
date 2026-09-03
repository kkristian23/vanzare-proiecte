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
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", refreshScript, "-SyncOnly", "-ChangedOnly"],
    {
      cwd: root,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    },
  );
  refresh.unref();
  console.log("Verificarea proiectelor modificate a pornit în fundal.");
}

function readRunningDevServer() {
  if (mode !== "dev") return null;

  try {
    const lock = JSON.parse(fs.readFileSync(devLockPath, "utf8"));
    if (!Number.isInteger(lock.pid) || lock.pid <= 0) return null;
    process.kill(lock.pid, 0);
    return lock;
  } catch {
    return null;
  }
}

const runningDevServer = readRunningDevServer();
if (runningDevServer) {
  // `localhost` may resolve to an unrelated IPv6 listener on Windows. The
  // vinext server binds IPv4, so always print an address that reaches it.
  console.log(`Site-ul rulează deja la http://127.0.0.1:${runningDevServer.port}`);
  startShowcaseRefresh();
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

// Acest proiect are o adresă stabilă: nu căutăm și nu acceptăm un port alternativ.
const selectedPort = await findAvailablePort(3000);
if (selectedPort !== 3000) {
  throw new Error("Portul 3000 este ocupat. Oprește procesul respectiv și pornește din nou acest proiect.");
}
const hostArgs = hasExplicitHost ? [] : ["--host", "127.0.0.1"];
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
const refreshTimer = setTimeout(() => {
  startShowcaseRefresh();
}, 1500);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    clearTimeout(refreshTimer);
    if (!server.killed) server.kill(signal);
  });
}

server.once("exit", (code, signal) => {
  clearTimeout(refreshTimer);
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
