SET NODE_TLS_REJECT_UNAUTHORIZED=0
SET BOTBUILDER_CFG={cwd}\data\config.json
node node-red\red.js -s data\node-red-config.js
