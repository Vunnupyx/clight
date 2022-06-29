FROM node:16-alpine as build

COPY package.json package.json
COPY client/material-theme client/src client/angular.json client/nginx.conf client/package.json client/proxy.conf.json client/proxy.conf.json client/tsconfig.app.json client/tsconfig.json client/tsconfig.spec.json client/
COPY user-docs/docs user-docs/i18n user-docs/src user-docs/static user-docs/babel.config.js user-docs/docusaurus.config.js user-docs/package.json user-docs/sidebars.js user-docs/versions.json user-docs/
RUN yarn build:webserver

FROM arm64v8/nginx:1.21.3-alpine

COPY --from=build client/dist/mdc-light-client /var/www
COPY client/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080

ENTRYPOINT ["nginx","-g","daemon off;"]
