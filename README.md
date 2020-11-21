# node-postgres-api
## What is it?
Repo for API for fictional restaurant "Miruna" written using Node.js express and PostgreSQL

## Setting up
#### Deploy database

1. Create database DATABASE_NAME
2. Create tables, constraints and insert initial records using following command:

`psql -d DATABASE_NAME -f create_tables.sql`

same with add_constraints.sql, insert_records.sql and auth.sql

#### Configs

1. Add database URL to enviromental variables or set it in .env file
2. Add server listening port to environmental variables or set it in config file. Default: `3000`

#### Install packages
`npm install`

#### Run server
Run `npm start` from / directory

Or
`npm test` to start server with nodemon

> Check out description of routes on / path, or source code instead