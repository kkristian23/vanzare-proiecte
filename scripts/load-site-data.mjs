import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

// Build tooling reads the same pure TypeScript data modules as the application.
// Transpilation preserves JSON imports and extensionless relative imports on Node 22.
const cache = new Map();
export function loadSiteModule(file, root = process.cwd()) {
  const requested = path.resolve(root, file);
  const filename = [requested, `${requested}.ts`, `${requested}.tsx`, `${requested}.json`, path.join(requested, "index.ts")]
    .find((candidate) => existsSync(candidate) && /\.(?:tsx?|json)$/.test(candidate));
  if (!filename) throw new Error(`Site data module not found: ${requested}`);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loadedModule = { exports: {} };
  cache.set(filename, loadedModule);
  if (filename.endsWith(".json")) {
    loadedModule.exports = JSON.parse(readFileSync(filename, "utf8"));
    return loadedModule.exports;
  }
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const nativeRequire = createRequire(filename);
  const localRequire = (specifier) => specifier.startsWith(".")
    ? loadSiteModule(specifier, path.dirname(filename))
    : specifier.startsWith("@/") ? loadSiteModule(specifier.slice(2), root) : nativeRequire(specifier);
  const evaluate = vm.runInThisContext(`(function(exports, require, module, __filename, __dirname) {\n${source}\n})`, { filename });
  evaluate(loadedModule.exports, localRequire, loadedModule, filename, path.dirname(filename));
  return loadedModule.exports;
}
