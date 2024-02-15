FROM node:21

WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install; \
        fi

COPY . ./
ENV PORT 8000
EXPOSE $PORT
RUN npm run build
# CMD ["node", "dist/app/index.js"]