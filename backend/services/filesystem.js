'use strict'

const rimraf = require("rimraf");
const { promises: Fs } = require("fs");

async function exists(path) {
  try {
    await Fs.access(path);
    return true;
  } catch {
    return false;
  }
}

module.exports.deleteFolder = async (dirPath) => {
  try {
    const exist = await exists(dirPath);
    if (!exist) throw `${dirPath} don't exist.`;

    await Fs.rmdir(dirPath, { recursive: true, force: true });
    return `DELETED ${dirPath}`;
  } catch (err) {
    throw err;
  }
};
