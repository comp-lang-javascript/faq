set pwd=%cd%
rmdir /S /Q %pwd%\output
java -jar Markdown\jsrun.jar Markdown\app\run.js -i=%pwd%\src -o=%pwd%\output -r=%pwd%\resources -t=%pwd%\templates
xcopy /S %pwd%\src\*.* %pwd%\output