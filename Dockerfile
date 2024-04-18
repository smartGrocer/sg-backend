# # src:
# # https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bullseye-slim as base
# RUN apk add --no-cache gcompat libstdc++
# RUN apt-get update && apt-get install -y libstdc++6 && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

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

USER node

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./
COPY /app/data ./app/data


EXPOSE 8000

CMD ["node", "app/index.js"]