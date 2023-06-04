# Temp development

При сборке помимо основного бандла генерируется файл библиотеки pdf.js, с названием в виде хэша
В файле index.tsx pdfjs.GlobalWorkerOptions.workerSrc = указать downloadLink этого файла с платформы
