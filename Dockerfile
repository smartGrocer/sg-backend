# src:
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

# FROM node:lts-alpine3.19 as build
# WORKDIR /app
# COPY package*.json .
# RUN npm install
# COPY --chown=node:node . ./
# RUN npm run build

# FROM node:lts-alpine3.19
# # ENV NODE_ENV=production
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY --from=build /app/dist ./dist


# ENV PORT 8000
# EXPOSE $PORT

# # EXPOSE 8000

# USER node

# CMD ["node", "dist/app/index.js"]

ARG NODE_VERSION=20

FROM node:${NODE_VERSION} as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:${NODE_VERSION} as deps
WORKDIR /app
COPY package*.json ./
# ARG NODE_ENV=production
RUN npm install 
#--only=production && npm cache clean --force

FROM node:${NODE_VERSION}
RUN apt-get update && apt-get install -y tree
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./
COPY --from=build /app/package.json ./
COPY /app/data ./app/data

# RUN tree -I node_modules && exit 1

ENV PORT 8000
EXPOSE $PORT

USER node
CMD ["node", "app/index.js"]