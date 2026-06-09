@echo off
title PlayStop Frontend

cd /d %~dp0

echo Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias por primera vez...
    npm install
)

echo.
echo Iniciando PlayStop Frontend en http://localhost:5173
echo Presiona Ctrl+C para detener.
echo.

npm run dev
pause
