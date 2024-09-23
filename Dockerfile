FROM node:18-alpine AS builder

ENV NODE_ENV production
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
