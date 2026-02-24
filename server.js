import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PORT = Number(process.env.PORT || 3000);

function startFallback(err) {
  const msg = `BOOT ERROR (server.js)\n\n${err?.stack || err}\n`;
  const server = http.createServer((req, res) => {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(msg);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log("Fallback server ON port", PORT);
    console.log(msg);
  });
}

process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection:", e);
  startFallback(e);
});

process.on("uncaughtException", (e) => {
  console.error("uncaughtException:", e);
  startFallback(e);
});

(async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const serverDir = path.join(__dirname, "server");
    const entry = path.join(serverDir, "src", "index.js");

    process.chdir(serverDir);
    await import(pathToFileURL(entry).href);
  } catch (e) {
    console.error("BOOT ERROR:", e);
    startFallback(e);
  }
})();
