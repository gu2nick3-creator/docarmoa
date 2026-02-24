import path from "path";
import http from "http";
import { fileURLToPath } from "url";

const PORT = Number(process.env.PORT || 4000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    // roda backend com CWD=./server
    process.chdir(path.join(__dirname, "server"));

    // sobe o express real
    await import("./server/src/index.js");
  } catch (err) {
    const msg = err?.stack || String(err);
    console.error("BOOT ERROR:\n", msg);

    // se der erro ao subir, responde em HTTP (pra você ver no navegador)
    http
      .createServer((req, res) => {
        res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        res.end("BOOT ERROR (o app não conseguiu iniciar):\n\n" + msg);
      })
      .listen(PORT, "0.0.0.0");
  }
})();
