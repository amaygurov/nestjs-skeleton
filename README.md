# NestJS Skeleton
NestJS Skeleton

## Features
 - JS configurations for different environments (Ex.: `config/local`, `config/staging`)
 - passport.js( username/password + JWT )
 - TypeORM migrations
 - Terminus health check
 - Logger(Winston + Morgan)

## Configure 

## Migrations
Once you defined your models run following command to generate initial migration script: 
Generate migration script (based on models)
```typeorm migration:generate -n ${MIGRATION_NAME}```

Create empty migration script
```typeorm migration:create -n ${MIGRATION_NAME}```


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
