import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// força o "cwd" virar /server (porque seu backend usa process.cwd())
const serverDir = path.join(__dirname, "server");
process.chdir(serverDir);

// inicia o backend real
await import(pathToFileURL(path.join(serverDir, "src", "index.js")).href);
