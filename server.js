import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const PORT = Number(process.env.PORT || 4000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startFallback(err) {
  console.error("BOOT ERROR:", err);

  const body = `BOOT ERROR:\n\n${err?.stack || String(err)}\n`;

  const server = http.createServer((req, res) => {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(body);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log("Fallback server listening on port", PORT);
  });
}

(async () => {
  try {
    // Se existir /server, roda a API de dentro dele.
    const serverDir = fs.existsSync(path.join(__dirname, "server"))
      ? path.join(__dirname, "server")
      : __dirname;

    process.chdir(serverDir);

    // Entry real:
    const entryPath = fs.existsSync(path.join(serverDir, "src", "index.js"))
      ? path.join(serverDir, "src", "index.js")
      : path.join(serverDir, "server", "src", "index.js");

    await import(pathToFileURL(entryPath).href);
  } catch (err) {
    startFallback(err);
  }
})();
