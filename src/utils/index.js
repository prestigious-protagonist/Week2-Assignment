const fs = require('fs');
const path = require('path');

function ensureFilesDir() {
  const dir = path.join(__dirname, '..', 'files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

module.exports = { ensureFilesDir };
