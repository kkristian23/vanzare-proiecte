import vinext from "vinext";
import { defineConfig } from "vite";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig({
    server: {
      host: "0.0.0.0", port: 3004, strictPort: true,
      allowedHosts: ["vanzare-proiecte.localhost"],
      ...(isCodexSeatbeltSandbox ? { watch: { useFsEvents: false, usePolling: true } } : {}),
    },
    preview: { host: "0.0.0.0", port: 3004, strictPort: true, allowedHosts: ["vanzare-proiecte.localhost"] },
    plugins: [vinext()],
});
