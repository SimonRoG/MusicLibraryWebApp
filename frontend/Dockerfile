FROM node:lts-alpine as build

WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build

FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /frontend/dist /frontend/dist
EXPOSE 80
