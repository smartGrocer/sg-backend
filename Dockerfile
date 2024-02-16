FROM node:21

USER node

WORKDIR /app
COPY package.json .


ARG NODE_ENV
RUN npm install
COPY . ./
ENV PORT 8000
EXPOSE $PORT
RUN npm run build