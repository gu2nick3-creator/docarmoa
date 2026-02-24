import http from "http";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Portas
const PUBLIC_PORT = Number(process.env.PORT || 3000);       // Porta que a Hostinger expõe
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 4001); // Porta interna do backend

// Pastas
const distDir = path.join(__dirname, "dist");
const backendCwd = path.join(__dirname, "server"); // backend roda dentro de /server
const uploadsDir = path.join(backendCwd, "uploads");

// Log do backend (pra você conseguir ver o erro sem depender do painel)
const logFile = path.join(__dirname, "backend.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });

function writeLog(chunk) {
  try {
    logStream.write(chunk);
  } catch {}
}

// Sobe o backend como processo separado
const backend = spawn(process.execPath, ["src/index.js"], {
  cwd: backendCwd,
  env: { ...process.env, PORT: String(BACKEND_PORT) },
  stdio: ["ignore", "pipe", "pipe"],
});

backend.stdout.on("data", (d) => {
  process.stdout.write(d);
  writeLog(d);
});
backend.stderr.on("data", (d) => {
  process.stderr.write(d);
  writeLog(d);
});
backend.on("exit", (code) => {
  const msg = Buffer.from(`\n[backend] saiu com código: ${code}\n`);
  process.stdout.write(msg);
  writeLog(msg);
});

// Helpers
function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".map": "application/json; charset=utf-8",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8",
  };
  return map[ext] || "application/octet-stream";
}

function safeJoin(base, target) {
  const targetPath = path.normalize(path.join(base, target));
  if (!targetPath.startsWith(base)) return null;
  return targetPath;
}

// Proxy /api -> backend
function proxyToBackend(req, res) {
  const options = {
    hostname: "127.0.0.1",
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${BACKEND_PORT}`,
    },
  };

  const pReq = http.request(options, (pRes) => {
    res.writeHead(pRes.statusCode || 502, pRes.headers);
    pRes.pipe(res);
  });

  pReq.on("error", (err) => {
    const msg = `Proxy error: ${err?.message || err}\n`;
    send(res, 502, { "content-type": "text/plain; charset=utf-8" }, msg);
  });

  req.pipe(pReq);
}

// Servir arquivo estático
function serveFile(res, filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    const data = fs.readFileSync(filePath);
    send(res, 200, { "content-type": contentType(filePath) }, data);
    return true;
  } catch {
    return false;
  }
}

// Servir frontend SPA (Vite)
function serveFrontend(req, res) {
  if (!fs.existsSync(distDir)) {
    return send(
      res,
      500,
      { "content-type": "text/plain; charset=utf-8" },
      "dist/ não existe. O build do Vite não foi gerado no runtime.\n"
    );
  }

  const urlPath = (req.url || "/").split("?")[0];

  // arquivos do Vite (assets)
  const fileCandidate = safeJoin(distDir, urlPath === "/" ? "index.html" : urlPath.slice(1));
  if (fileCandidate && serveFile(res, fileCandidate)) return;

  // fallback SPA
  const indexFile = path.join(distDir, "index.html");
  if (serveFile(res, indexFile)) return;

  return send(res, 404, { "content-type": "text/plain; charset=utf-8" }, "Not found\n");
}

// Servir uploads
function serveUploads(req, res) {
  const urlPath = (req.url || "/").split("?")[0];
  const rel = urlPath.replace("/uploads/", "");
  const filePath = safeJoin(uploadsDir, rel);
  if (!filePath) return send(res, 403, { "content-type": "text/plain; charset=utf-8" }, "Forbidden\n");
  if (serveFile(res, filePath)) return;
  return send(res, 404, { "content-type": "text/plain; charset=utf-8" }, "Not found\n");
}

// Endpoint pra ver logs do backend (TEMPORÁRIO)
function serveBackendLogs(res) {
  try {
    const data = fs.readFileSync(logFile, "utf-8");
    const lines = data.split("\n").slice(-250).join("\n");
    send(res, 200, { "content-type": "text/plain; charset=utf-8" }, lines);
  } catch {
    send(res, 200, { "content-type": "text/plain; charset=utf-8" }, "Sem logs ainda.\n");
  }
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  // logs (pra diagnosticar)
  if (urlPath === "/__backend_logs") return serveBackendLogs(res);

  // uploads
  if (urlPath.startsWith("/uploads/")) return serveUploads(req, res);

  // api
  if (urlPath.startsWith("/api/")) return proxyToBackend(req, res);

  // frontend
  return serveFrontend(req, res);
});

server.listen(PUBLIC_PORT, "0.0.0.0", () => {
  const msg = `[root] rodando na porta ${PUBLIC_PORT} (backend interno ${BACKEND_PORT})\n`;
  process.stdout.write(msg);
  writeLog(Buffer.from(msg));
});

// Graceful shutdown
process.on("SIGTERM", () => {
  try { backend.kill("SIGTERM"); } catch {}
  try { logStream.end(); } catch {}
  process.exit(0);
});
