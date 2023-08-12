# Bera-backend

Backend service for Bera App, a Kanban-like daily task management app for developers.

## Presets

### Installation

```
pnpm i
```

### Init MySQL database

[Install Mysql](https://dev.mysql.com/downloads/mysql/) in your machine first(using legacy version password), then run:

```bash
# login mysql
$ mysql -u root -p

# source schema.dev.sql file in mysql CLI, absolute path
$ mysql > source /a/b/c/schema.dev.sql;

# run the script
$ npm run setup-mysql-db
```

### Init MongoDB

Follow the [Mongo Altas Tutorial](https://cloud.mongodb.com/) to get a free plan for testing. Then check out `Security > Quickstart`, you will have to generate a username/password pair for connection. I've stored mine as `AUTH_DB_USERNAME`/`AUTH_DB_PASSWORD` in a local `.env` file.


## Dockerize

### DB

Dump the mysql table struct into a `.sql` file in order to create copies of tables in the docker containers.

```
mysqldump -h <your_mysql_host> -u <user_name> -p --no-data <schema_name> > schema.sql
```
For our specific case:
```
mysqldump testdb -h 127.0.0.1 -u root -p --no-data > schema.sql
```

### Bera-backend

We have the build argument `DOCKER_ENV` which will be used in the `Dockerfile` commands as variable. `-t` tags the images with a name of `bera-backend` for clearance. And the root directory is `.`, the current working directory.
```bash
docker build --build-arg DOCKER_ENV=production -t bera-backend .
```

### Execution

Once we have set up, we can run the following commands to serve the DB and the backend service.

Build images:
```
docker-compose build
```

Then serve them:
```
docker-compose up
```


### Dev resources
- [MySQL](https://www.db4free.net/) for record storage
- [MongoDb](https://www.mongodb.com/cloud/atlas) for jwt auth data storage