import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const mode = process.argv[2] === "start" ? "start" : "dev";
const extraArgs = process.argv.slice(3);
const vinextCli = path.join(root, "node_modules", "vinext", "dist", "cli.js");
const refreshScript = path.join(root, "scripts", "run-showcase-refresh.ps1");

// Serverul principal primește prioritate și păstrează terminalul în prim-plan.
const server = spawn(process.execPath, [vinextCli, mode, ...extraArgs], {
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
  console.log("Actualizarea proiectelor secundare a pornit în fundal.");
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
