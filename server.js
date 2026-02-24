import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

process.on("unhandledRejection", (e) => console.error("unhandledRejection:", e));
process.on("uncaughtException", (e) => {
  console.error("uncaughtException:", e);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicia o backend dentro da pasta /server (onde está o Express + Prisma)
const serverDir = path.join(__dirname, "server");
const entry = path.join(serverDir, "src", "index.js");

try {
  process.chdir(serverDir);
  await import(pathToFileURL(entry).href);
} catch (err) {
  console.error("FATAL: não consegui iniciar o backend:", err);
  process.exit(1);
}
