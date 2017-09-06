#!/bin/bash
echo "create template"
cd "$1"
cd ..
wget https://github.com/NGRP/viseo-bot-template/archive/master.zip
unzip -d "$1" master.zip
ls "$1"
mv "$1"/viseo-bot-template-master/* "$1"
rm -rf "$1"/viseo-bot-template-master