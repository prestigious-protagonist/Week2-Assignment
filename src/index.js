const http = require('http');
const url = require('url');
const {StatusCodes} = require("http-status-codes")
require("dotenv").config()
const { handleFileRoutes } = require('./controller/file-controller');
const { ensureFilesDir } = require('./utils/index');

// Global error handlers to prevent server crash
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Ensuring file directory exists before the server starts
ensureFilesDir();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith('/file')) {
    handleFileRoutes(req, res, parsedUrl);
  } else {
    res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
