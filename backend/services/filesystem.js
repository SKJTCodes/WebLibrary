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
    
    rimraf(dirPath, function (err) {
      if (err) throw err;
    });
    return `Deleted ${dirPath}`;
  } catch (err) {
    throw err;
  }
};
