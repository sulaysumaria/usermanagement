# usermanagementapi

## Getting started

```bash
$ git clone
$ cd api
$ npm i
$ cp config-example.js config.js
# set mongodb url string in config.js
$ npm start
```

## Deploy

```bash
$ npm run deploy
```

## Endpoints

| Verb | Path  | Params    |
| ---- | ----- | --------- |
| GET  | /     |           |
| GET  | /user |           |
| POST | /user | userModel |

You can find postman collection in the repo

## Model

### userModel

| Property  | Type   | Req                | Validation     |
| --------- | ------ | ------------------ | -------------- |
| firstName | String | :heavy_check_mark: | Min:5, Max: 30 |
| lastName  | String | :heavy_check_mark: | Min:5, Max: 30 |
| email     | String | :heavy_check_mark: | Email format   |
