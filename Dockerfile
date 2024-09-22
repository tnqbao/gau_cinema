FROM node:18-alpine AS builder

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf node_modules

CMD ["npm", "start"]