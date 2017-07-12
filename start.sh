#!/bin/bash
NODE_TLS_REJECT_UNAUTHORIZED=0 \
BOTBUILDER_CFG="{cwd}/data/config.json" \
PORT=1880 \
pm2 \
start \
node-red/node-red-current/red.js --name="Sample" -- -s ./data/node-red-config.js