@echo off
setlocal enabledelayedexpansion

for %%f in (*.jpg) do (
    echo Обработка файла: %%f
    set "filename=%%~nf"
    magick.exe "%%f" -quality 80 "!filename!.webp"
)

echo Готово!
pause
