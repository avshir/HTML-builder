const process = require('process'); //stdout()
const path = require('path'); //join(), extname(), basename()
const fsPromises = require("fs/promises");// используем методы readdir(), stat()

const folderPath = path.join(__dirname, "secret-folder" );

async function filesFolder (myFolderPath) {
  const files = await fsPromises.readdir(myFolderPath, {withFileTypes: true}); //массив строк или (при вызове со вторым аргументом) массив объектов в виде fs.Dirent с name + тип файла (файл или папка)

  for (const file of files) {
    if (file.isFile()) {
      const linkFile = path.join(folderPath, file.name); //ссылка на файл
      const typeFile = path.extname(linkFile); //расширение файла типа  .txt
      const nameFile = path.basename(linkFile, typeFile); //название файла БЕЗ расширения (второй аргумент указывает, какое разрешение НЕ нужно передавать)
      const sizeFile = (await fsPromises.stat(linkFile)).size; //размер файла в bytes(B)
      
      process.stdout.write(
        `${nameFile} - ${typeFile.slice(1)} - ${sizeFile} B \n`
      );
    }
  }
}

filesFolder(folderPath); 