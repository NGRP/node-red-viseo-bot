#!/bin/bash
BOTBUILDER_CFG="{cwd}/data/config.json" \
PORT=1880 \
~/.nvm/versions/node/v6.6.0/lib/node_modules/pm2/bin/pm2 \
start \
/home/pseudo/node-red-viseo-bot/node-red/red.js --name="Sample" -- -s ./data/node-red-config.js