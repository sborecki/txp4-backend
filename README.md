# txp4
Trackmania Experience v4

## Preparation

* Install [Node.js](https://nodejs.org).
* Install [yarn](https://yarnpkg.com).

## Development

Run in separate terminals:

* rebuild application on change:
```
yarn build:watch
```

* restart application on change:
```
yarn start:watch
```

* lint your code:
```
yarn lint:watch
```

## Before first launch
Project requires working MongoDB database.
Open README_mongoDB.txt and follow the instructions.
Please also set up variable names:
ADMIN_AUTH_SECRET
SERVER_AUTH_SECRET
PORT