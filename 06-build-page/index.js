const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const nameBuildFolder = path.join(__dirname, "project-dist");
const pathHtmlTemplate = path.join(__dirname, "template.html");
const pathHtmlComponents = path.join(__dirname, "components");

const folderPathOriginal = path.join(__dirname, "assets");
const folderPathCopied = path.join(__dirname, "project-dist", "assets");


async function buildHTML(pathHtmlTemplate, nameBuildFolder, pathHtmlComponents) {
  try {
    const htmlFile = path.join(nameBuildFolder, "index.html");
    const writeStreamHtml = fs.createWriteStream(htmlFile, "utf-8"); //создали файл index.html

    const objComponents = {}; //объект с компонентами Html
    const filesHTML = await fsPromises.readdir(pathHtmlComponents, {
      withFileTypes: true,
    });

    for (let file of filesHTML) {
      const currentFile = path.join(pathHtmlComponents, file.name);
      const typeFile = path.extname(currentFile);
      const basenameFile = path.basename(currentFile, typeFile);

      if (file.isFile() && typeFile === ".html") {
        const currentFileData = await fsPromises.readFile(
          currentFile,
          "utf-8",
          (err, data) => {
            if (err) throw err;
          }
        );
        objComponents[basenameFile] = currentFileData;
      }
    }

    let templateData = await fsPromises.readFile(pathHtmlTemplate, "utf-8"); //string, прочитали шаблон html

    //заменили в шаблоне компоненты html
    for (let component in objComponents) {
      let reg = `{{${component}}}`;
      templateData = templateData.replace(reg, objComponents[component]);
    }
    writeStreamHtml.write(templateData); //записали итоговые данные в файл index.html
  } catch (err) {
    console.error("Error in buildHTML: " + err.message);
  }
}

async function buildStyles(nameFolderFrom, nameFolderTo, nameFileTo) {
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
    console.error("Error in buildStyles: " + err.message);
  }
}

async function copyFiles(originalFolder, newFolder) {
  try {
    await fsPromises.rm(newFolder, { recursive: true, force: true }); //удаляем папку, если она была ранее создана

    await fsPromises.mkdir(newFolder, { recursive: true }); //создаем новую папку

    const filesOriginal = await fsPromises.readdir(originalFolder, {withFileTypes: true}); //чтение cодержимого папки originalFolder, получиили массив с объектами <fs.Dirent>
      
    for (const file of filesOriginal) {
      if(file.isFile()) {
        const linkFile = path.join(originalFolder, file.name); //ссылка на текущий файл
        const newLinkFile = path.join(newFolder, file.name); //ссылка на новый файл
        await fsPromises.copyFile(linkFile, newLinkFile); //создаем и копируем содержимое(перезаписываем) каждого файла из оригинальной папки в новую
      } else if (file.isDirectory()) {
        copyFiles(
          path.join(originalFolder, file.name),
          path.join(newFolder, file.name)
        ); //рекурсивно вызываем copyFiles для вложенных папок
      }
    }
  } catch (err) {
    console.error("Error in copyFiles: " + err.message);
  }
}

async function buildPage() {
  await fsPromises.rm(nameBuildFolder, { recursive: true, force: true }); //удаляем папку, если она была ранее создана
  await fsPromises.mkdir(nameBuildFolder, { recursive: true }); //создаем новую папку

  await buildStyles("styles", "project-dist", "style.css"); // создание единого файла со стилями
  await copyFiles(folderPathOriginal, folderPathCopied); // копируем папку assets c содержимым
  await buildHTML(pathHtmlTemplate, nameBuildFolder, pathHtmlComponents);
}
buildPage();