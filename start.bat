SET NODE_TLS_REJECT_UNAUTHORIZED=0
SET BOTBUILDER_CFG={cwd}\data\config.json
SET PORT=1880
node node-red\node-red-current\red.js -s data\node-red-config.js
