@echo off
echo Abriendo 5 URLs en Google Search Console para solicitar indexacion...
echo En cada pestana, haz clic en "Solicitar indexacion" y espera a que termine.
echo.

start "" "chrome.exe" "https://search.google.com/search-console/inspect?resource_id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2F&id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2Fleccion%%2Fa1"
timeout /t 2 >nul

start "" "chrome.exe" "https://search.google.com/search-console/inspect?resource_id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2F&id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2Fleccion%%2Fa2"
timeout /t 2 >nul

start "" "chrome.exe" "https://search.google.com/search-console/inspect?resource_id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2F&id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2Fleccion%%2Fb1"
timeout /t 2 >nul

start "" "chrome.exe" "https://search.google.com/search-console/inspect?resource_id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2F&id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2Fleccion%%2Fc1"
timeout /t 2 >nul

start "" "chrome.exe" "https://search.google.com/search-console/inspect?resource_id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2F&id=https%%3A%%2F%%2Fconcurso-docente-ral.netlify.app%%2Fleccion%%2Fd1"

echo.
echo Listo. 5 pestanas abiertas. Haz clic en "Solicitar indexacion" en cada una.
echo Manana puedes volver a ejecutar este script con las siguientes 5 URLs.
pause
