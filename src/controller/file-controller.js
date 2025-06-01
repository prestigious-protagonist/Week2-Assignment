const fileService = require('../service/file-service');
const { StatusCodes } = require('http-status-codes');

async function handleFileRoutes(req, res, parsedUrl) {
  const query = parsedUrl?.query;
  const fileName = query?.name?.trim();

  if (!fileName) {
    res.writeHead(StatusCodes.BAD_REQUEST, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Filename is required' }));
  }

  if (parsedUrl.pathname === '/file/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const { content } = JSON.parse(body);
        await fileService.createFile(fileName, content || '');
        res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File created', file: fileName }));
      } catch (err) {
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });

    req.on('error', (err) => {
      res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request error' }));
    });

  } else if (parsedUrl.pathname === '/file/read' && req.method === 'GET') {
    try {
      const content = await fileService.readFile(fileName);
      res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ file: fileName, content }));
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
      } else {
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    }

  } else if (parsedUrl.pathname === '/file/delete' && req.method === 'DELETE') {
    try {
      await fileService.deleteFile(fileName);
      res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'File deleted', file: fileName }));
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
      } else {
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    }

  } else {
    res.writeHead(StatusCodes.METHOD_NOT_ALLOWED, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
}

module.exports = { handleFileRoutes };
