@echo off
echo ========================================
echo Fixing TypeScript Errors - Automated
echo ========================================
echo.

echo Step 1: Checking Prisma Client...
cd packages\db
if exist "..\..\node_modules\.prisma\client\index.d.ts" (
    echo [OK] Prisma Client types found!
) else (
    echo [WARN] Prisma Client not found, generating...
    call npx prisma generate
)

echo.
echo Step 2: Verifying schema...
call npx prisma validate
if %ERRORLEVEL% EQU 0 (
    echo [OK] Prisma schema is valid!
) else (
    echo [ERROR] Schema validation failed!
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next step: Restart TypeScript in VS Code
echo.
echo 1. Press Ctrl+Shift+P
echo 2. Type: TypeScript: Restart TS Server
echo 3. Press Enter
echo.
echo Red errors should disappear!
echo ========================================
pause
