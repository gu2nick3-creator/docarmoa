import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// entra na pasta /server (pra distPath ../dist funcionar)
process.chdir(path.join(__dirname, "server"));

// inicia o backend real
await import("./server/src/index.js");
