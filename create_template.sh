#!/bin/bash

echo "create template"
cd /app
wget https://github.com/NGRP/viseo-bot-template/archive/master.zip
unzip -d /app/bot master.zip 
mv /app/bot/viseo-bot-template-master/* /app/bot
rm -rf /app/bot/viseo-bot-template-master