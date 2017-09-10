@echo off

:: Project paths
IF "%BOT_ROOT%" == "" GOTO HELPER
SET FRAMEWORK_ROOT=%~dp0

:: Project configs
IF "%CONFIG_PATH%"      == "" SET CONFIG_PATH=%BOT_ROOT%\conf\config.js
IF "%NODE_RED%"         == "" SET NODE_RED=%FRAMEWORK_ROOT%\node_modules\node-red\red.js
IF "%NODE_RED_CONFIG%"  == "" SET NODE_RED_CONFIG=%FRAMEWORK_ROOT%\conf\node-red-config.js

:: Project parameters
IF "%NODE_ENV%" == "" SET NODE_ENV=dev
IF "%PORT%"     == "" SET PORT=1880
IF "%HOST%"     == "" SET HOST=http://127.0.0.1
:: SET CREDENTIAL_SECRET=a-secret-key

:: Required to fix SSL issues
SET NODE_TLS_REJECT_UNAUTHORIZED=0

:: MUST start in the project folder
@echo Starting Node-RED
CD %BOT_ROOT%
node "%NODE_RED%" -s "%NODE_RED_CONFIG%"
GOTO END

:HELPER

@echo This script require following variables:
@echo - BOT_ROOT: the project directory
@echo - NODE_ENV: the properties configuration (dev)
@echo - PORT:     the server port (1880)
@echo - HOST:     the external host URL
@echo NodeJS v8 must be into the PATH

:END