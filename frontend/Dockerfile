FROM node:lts-alpine AS node

WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build

FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=node /frontend/dist /frontend/dist
EXPOSE 80
