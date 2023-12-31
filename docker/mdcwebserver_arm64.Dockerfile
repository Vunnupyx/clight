FROM node:16-alpine as build

WORKDIR /app

# Install python/pip
RUN apk add g++ make py3-pip

ARG MDC_LIGHT_WEBSERVER_VERSION
RUN echo Building webserver ${MDC_LIGHT_WEBSERVER_VERSION}

COPY package.json package.json
COPY client/ client/
COPY user-docs/ user-docs/

RUN yarn build:webserver

FROM arm64v8/nginx:1.21.3-alpine

COPY --from=build /app/client/dist/mdc-light-client /var/www
COPY client/nginx.conf /etc/nginx/nginx.conf

EXPOSE 443/tcp

ENTRYPOINT ["nginx","-g","daemon off;"]
