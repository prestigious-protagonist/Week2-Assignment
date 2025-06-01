const http = require('http');
const url = require('url');
const { handleFileRoutes } = require('./controller/file-controller');
const { ensureFilesDir } = require('./utils/index');

// Global error handlers to prevent server crash
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Ensure files directory exists at startup
ensureFilesDir();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith('/file')) {
    handleFileRoutes(req, res, parsedUrl);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
