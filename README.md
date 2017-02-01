# destiny
Managing views for destiny clans

## install
curl https://install.meteor.com/ | sh

## Start
meteor --settings file.json

## Stop all
kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`