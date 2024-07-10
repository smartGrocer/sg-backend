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

RUN --mount=type=bind,source=backend/package.json,target=package.json \
    --mount=type=bind,source=backend/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Stage 3: Build the backend
FROM deps as build

WORKDIR /sg-app/backend

RUN --mount=type=bind,source=backend/package.json,target=package.json \
    --mount=type=bind,source=backend/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY ./backend .

RUN npm run build

# Stage 4: Create the final image
FROM base as final

WORKDIR /sg-app

ENV NODE_ENV production

# This is to allow permissions for creating /logs and newrelic_agent.log files
RUN chown -R node:node .

USER node

COPY backend/package.json ./backend/package.json

COPY --from=deps /sg-app/backend/node_modules ./backend/node_modules
COPY --from=build /sg-app/backend/dist ./backend/dist
COPY --from=build-frontend /sg-app/frontend/dist ./backend/public

COPY backend/app/data ./app/data

EXPOSE 8000

CMD ["node", "backend/dist/index.js"]
