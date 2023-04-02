FROM --platform=arm64 node:16

# Create app directory if not exist
RUN mkdir -p /usr/src/app
# Set the working directory for commands like ADD/COPY/RUN/CMD/ENTRYPOINT
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . /usr/src/app

# Declare the incoming argument DOCKER_ENV
ARG DOCKER_ENV
# Define NODE_ENV with DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
# echo some msg
RUN if [ "${DOCKER_ENV}" = "development" ] ; then echo "your NODE_ENV for dev is ${NODE_ENV}" ; else echo "your NODE_ENV for prod is ${NODE_ENV}" ; fi

EXPOSE 8080

CMD [ "node", "index.js" ]