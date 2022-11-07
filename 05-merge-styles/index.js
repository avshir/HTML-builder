const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

async function buildFiles(nameFolderFrom, nameFolderTo, nameFileTo) {
  try {
    const originalFolder = path.join(__dirname, nameFolderFrom); //папка, откуда будем объединять файлы
    const bundleFile = path.join(__dirname, nameFolderTo, nameFileTo); //итоговый файл
    const writeStream = fs.createWriteStream(bundleFile, "utf-8"); //cоздали поток записи в итоговый файл

    const filesStyles = await fsPromises.readdir(originalFolder, {withFileTypes: true}); //чтение cодержимого папки 'styles', получили массив с объектами <fs.Dirent>

    for (let file of filesStyles) {
      const currentFile = path.join(originalFolder, file.name); //ссылка на текущий файл
      const typeFile = path.extname(currentFile); //расширение файла

      if (file.isFile() && typeFile === ".css") {
        const currentFileData = await fsPromises.readFile(
          currentFile,
          "utf-8",
          (err, data) => {
            if (err) throw err;
          }
        );
        writeStream.write(currentFileData + "\n");
      }
    }
  } catch (err) {
    console.error("Упс, ошибка!: " + err.message);
  }
}

buildFiles("styles", "project-dist", "bundle.css");