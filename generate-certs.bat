@echo off
echo Creating certificates for HTTPS...

:: Create certificates directory if it doesn't exist
if not exist certificates mkdir certificates

:: Change to certificates directory
cd certificates

:: Generate certificates
echo Generating certificates using mkcert...
call mkcert localhost 127.0.0.1 ::1

:: Rename files to expected names
echo Renaming certificate files...
ren "localhost+2-key.pem" "localhost-key.pem"
ren "localhost+2.pem" "localhost.pem"

echo Certificate generation complete!
echo You can now run "npm run dev:https" to start the server with HTTPS
pause
