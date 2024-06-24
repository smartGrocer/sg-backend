# # src:
# # https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bullseye-slim as base

WORKDIR /app

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM base as final

ENV NODE_ENV production

# This is to allow permissions for creating /logs and newrelic_agent.log files
RUN chown -R node:node .

USER node

COPY package.json .

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./
COPY /app/data ./app/data

# RUN echo $(pwd) && ls -la && exit 1
# RUN ls -la && exit 1
# RUN ls -la app && exit 1

EXPOSE 8000

CMD ["node", "index.js"]