# Bera-backend

Backend service for Bera App, a Kanban-like daily task management app for developers.

# API

## GET

### `/kanban/:id`

### `/todolist`

###

## POST

### `/login`

## Delete

## PUT


# Dockerize

## build

We have the build argument `DOCKER_ENV` which will be used in the `Dockerfile` commands as variable. `-t` tags the images with a name of `bera-backend` for clearance. And the root directory is `.`, the current working directory.
```bash
docker build --build-arg DOCKER_ENV=production -t bera-backend .
```