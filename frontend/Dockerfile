FROM node:lts-alpine as build

WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
