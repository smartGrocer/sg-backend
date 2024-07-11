ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bullseye-slim as base

WORKDIR /sg-app

# Stage 1: Build the frontend
FROM base as build-frontend

WORKDIR /sg-app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Install backend dependencies
FROM base as deps

WORKDIR /sg-app/backend

COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev


# Stage 3: Build the backend
FROM deps as build

WORKDIR /sg-app/backend


COPY backend/ ./

# install typescript to build the backend
RUN npm install -g typescript

RUN npm run build

# Stage 4: Create the final image
FROM base as final

WORKDIR /sg-app

ENV NODE_ENV production


COPY backend/package.json ./backend/package.json

COPY --from=deps /sg-app/backend/node_modules ./backend/node_modules
COPY --from=build /sg-app/backend/dist ./backend/dist
COPY --from=build-frontend /sg-app/frontend/dist ./backend/public

COPY backend/app/data ./backend/app/data

# This is to allow permissions for creating /logs and newrelic_agent.log files
RUN chown -R node:node .

USER node

EXPOSE 8000


