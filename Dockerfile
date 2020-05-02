# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:14-alpine
ENV NODE_ENV production

# Tini - A tiny but valid init for containers
# https://github.com/krallin/tini
RUN apk add --no-cache tini

# Set app directory; create if non-existent.
#USER node
#RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy package.json and package-lock.json to WORKDIR.
# If neither has changed since last build, then Docker will use cached results
# from the RUN command below as well.
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache
COPY package*.json ./

# Install dependencies into WORKDIR.
# Dev dependencies are also required for the build below.
# See Dockerfile.prod for a multi-stage build that excludes dev dependencies.
RUN npm install --production=false

# Copy the build context
# (project directory excluding files/dirs in .dockerignore)
# to WORKDIR.
COPY . .

# Build.
RUN npm run build

# Set app to run on port 3000 and expose port.
ENV PORT 3000
EXPOSE 3000

# Commands on this container are run as node user.
USER node

# Don't make Node.js accept the burden of running as PID 1.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]

# Default command is to start app.
CMD ["node", "dist"]
