FROM node:20.12.0


WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN npm install
COPY . ./

ENV PORT 8000
EXPOSE $PORT

RUN npm run build

USER node

CMD ["npm", "start"]
