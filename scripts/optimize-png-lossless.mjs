import { open, readdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "public");
const defaultBinary = path.resolve(
  "work/tools/oxipng-10.1.1/oxipng-10.1.1-x86_64-pc-windows-msvc/oxipng.exe",
);
const binary = process.env.OXIPNG_BIN ?? defaultBinary;
const files = [];

async function isPng(file) {
  const handle = await open(file, "r");
  try {
    const header = Buffer.alloc(8);
    await handle.read(header, 0, header.length, 0);
    return header.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  } finally {
    await handle.close();
  }
}

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(target);
    else if (path.extname(entry.name).toLowerCase() === ".png" && await isPng(target)) files.push(target);
  }
}

async function bytes(items) {
  return (await Promise.all(items.map(async (item) => (await stat(item)).size)))
    .reduce((total, size) => total + size, 0);
}

await collect(root);
const before = await bytes(files);
await new Promise((resolve, reject) => {
  // OxiPNG recompresses PNG data losslessly. `--strip safe` removes only
  // non-rendering metadata; it never changes pixels, alpha, or dimensions.
  const child = spawn(binary, ["-o", "max", "--strip", "safe", ...files], {
    cwd: process.cwd(),
    stdio: "inherit",
    windowsHide: true,
  });
  child.once("error", (error) => reject(new Error(`OxiPNG unavailable at ${binary}: ${error.message}`)));
  child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`OxiPNG exited with ${code}`)));
});
const after = await bytes(files);
console.log(`Lossless PNG optimization: ${(before / 1024 / 1024).toFixed(1)} → ${(after / 1024 / 1024).toFixed(1)} MiB; saved ${((before - after) / 1024 / 1024).toFixed(1)} MiB.`);
