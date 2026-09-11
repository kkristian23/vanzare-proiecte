/** Canonical URLs are stored even in tests; only a loopback emulator build rewrites delivery. */
export function displayImageUrl(src: string) {
  if (
    import.meta.env.VITE_FIREBASE_EMULATORS === "true" &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID === "demo-monodev" &&
    typeof location !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(location.hostname)
  ) {
    return src.replace(
      "https://firebasestorage.googleapis.com",
      "http://127.0.0.1:9199",
    );
  }
  return src;
}
