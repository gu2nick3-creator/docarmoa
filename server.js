import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Faz o backend rodar como se estivesse dentro da pasta /server
process.chdir(path.join(__dirname, "server"));

// Inicia o Express real
await import("./server/src/index.js");
