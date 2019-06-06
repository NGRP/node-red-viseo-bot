@echo off

:initArgs
:: asks for the -foo argument and store the value in the variables
:: ./start.bat [ -port port ] [ -host http://host.url ] [ -bot botfoldername ] [ -env dev|quali|prod ] [ -cred passphrase ] [ -ui nodereduiroute]


call:getArgWithValue "-port" "PORT" "%~1" "%~2" && shift && shift && goto :initArgs
call:getArgWithValue "-host" "HOST" "%~1" "%~2" && shift && shift && goto :initArgs
call:getArgWithValue "-bot" "BOT" "%~1" "%~2" && shift && shift && goto :initArgs
call:getArgWithValue "-env" "NODE_ENV" "%~1" "%~2" && shift && shift && goto :initArgs
call:getArgWithValue "-cred" "CREDENTIAL_SECRET" "%~1" "%~2" && shift && shift && goto :initArgs
call:getArgWithValue "-ui" "NODE_RED_ROUTE" "%~1" "%~2" && shift && shift && goto :initArgs

:: Project default settings
if "%PORT%" == "" SET PORT=1880
if "%HOST%" == "" SET HOST=http://127.0.0.1
if "%NODE_ENV%"  == "" SET NODE_ENV=dev

:: Project paths
SET FRAMEWORK_ROOT=%~dp0
CD ..
SET FOLDER_ROOT=%~dp0

if "%BOT%" neq "" (
  SET BOT_ROOT=%FOLDER_ROOT%projects\%BOT%
  SET CONFIG_PATH=%BOT_ROOT%\conf\config.js
) else (
  @echo Warning - No bot specified
  SET BOT=""
  SET BOT_ROOT="."
  SET CONFIG_PATH="."
)

SET ENABLE_PROJECTS=true
SET NODE_RED_DISABLE_EDITOR=false

:: Project configs
IF "%NODE_RED%"         == "" SET NODE_RED=%FRAMEWORK_ROOT%node_modules\node-red\red.js
IF "%NODE_RED_CONFIG%"  == "" SET NODE_RED_CONFIG=%FRAMEWORK_ROOT%conf\node-red-config.js


:: Required to fix SSL issues
SET NODE_TLS_REJECT_UNAUTHORIZED=0

:: MUST start in the project folder
@echo Starting Node-RED
CD %BOT_ROOT%
node "%NODE_RED%" -s "%NODE_RED_CONFIG%"

EXIT /B 0
goto:eof

:: =====================================================================
:: This function sets a variable from a cli arg with value
:: 1 cli argument name
:: 2 variable name
:: 3 current Argument Name
:: 4 current Argument Value

:getArgWithValue
if "%~3"=="%~1" (
  if "%~4"=="" (
    REM unset the variable if value is not provided
    set "%~2="
    exit /B 1
  )
  set "%~2=%~4"
  exit /B 0
)
exit /B 1
goto:eof

:helper

@echo "Error - usage : ./start.bat -bot [ botfoldername ] [ -port port ] [ -host http://host.url ] [ -env dev|quali|prod ] [ -cred passphrase ]"

:END
