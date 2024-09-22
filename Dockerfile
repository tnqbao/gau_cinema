FROM node:18-alpine AS builder

ENV NODE_ENV production
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["npm", "start"]