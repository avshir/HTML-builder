const path = require("path");//join()
const fsPromises = require('fs/promises'); //rm(), mkdir(), readdir(), copyFile()

const fromFolderPath = path.join(__dirname, "files");
const toFolderPath = path.join(__dirname, "files-copy");

async function copyFiles(originalFolder, newFolder) {
  try {
    await fsPromises.rm(newFolder, { recursive: true, force: true }); //удаляем папку, если она была ранее создана

    await fsPromises.mkdir(newFolder, { recursive: true }); //создаем новую папку

    const filesOriginal = await fsPromises.readdir(originalFolder); //получаем содержимое оригинальной папки в виде массива строк

    for (let file of filesOriginal) {
      const linkFile = path.join(originalFolder, file); //ссылка на текущий файл
      const newLinkFile = path.join(newFolder, file); //ссылка на новый файл
      await fsPromises.copyFile(linkFile, newLinkFile); //создаем и копируем содержимое(перезаписываем) каждого файла из оригинальной папки в новую
    }
  } catch (err) {
    console.log("Упс, ошибка!");
    console.error(err.message);
  }

} 

copyFiles(fromFolderPath, toFolderPath);