const fs = require('fs');
const path = require('path');
const { ensureFilesDir } = require('../utils/index');

const getFilePath = (fileName) => {
  // Make sure directory exists (extra safety)
  ensureFilesDir();
  return path.join(__dirname, '..', 'files', fileName);
};

function createFile(fileName, content) {
  const filePath = getFilePath(fileName);
  return fs.promises.writeFile(filePath, content);
}

function readFile(fileName) {
  const filePath = getFilePath(fileName);
  return fs.promises.readFile(filePath, 'utf-8');
}

function deleteFile(fileName) {
  const filePath = getFilePath(fileName);
  return fs.promises.unlink(filePath);
}

module.exports = {
  createFile,
  readFile,
  deleteFile,
};
