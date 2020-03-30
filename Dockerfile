FROM node:stretch as build-env

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx:1.17.9 as run-env

RUN apt-get update && rm -rf /var/lib/apt/lists/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-env /usr/src/app/build/ /var/www/

RUN chmod -R 755 /var/www/ && chown -R nginx:nginx /var/www/ && chmod -R 755 /etc/nginx/ && chown -R nginx:nginx /etc/nginx/
