# Bera-backend

Backend service for Bera App, a Kanban-like daily task management app for developers.

## APIs

## Init MySQL database

Install Mysql in your machine first, then run:

```
npm run setup-mysql-db
```

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
