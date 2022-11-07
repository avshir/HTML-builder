const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath);

stdout.write("Введите текст в консоль\n");//вывод в консоль
stdin.on("data", (chunk) => {
  let chunkToStr = chunk.toString();

  if (chunkToStr.trim() === "exit") {
    stdout.write("Хорошего дня!");
    process.exit();
  } else {
    writeableStream.write(chunkToStr);
  }
});

stdin.on("error", (error) => console.error(error.message));

//слушает нажатие Ctrl + c
process.on('SIGINT', () => {
  stdout.write('Удачи на курсе!');
  process.exit();
});
