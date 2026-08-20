import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

for (const args of [
  [resolve(projectRoot, "node_modules/typescript/bin/tsc"), "-b"],
  [resolve(projectRoot, "node_modules/vite/bin/vite.js"), "build"],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
