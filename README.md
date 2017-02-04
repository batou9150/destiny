# destiny
Managing views for destiny clans

## install
curl https://install.meteor.com/ | sh

meteor npm install

## Configuration : settings.json
```json
{
  "bungie": {
    "api_key": "YOUR_API_KEY"
  }
}
```

## Start
meteor --settings settings.json

## Stop all
kill -9 \`ps ax | grep node | grep meteor | awk '{print $1}'\`
