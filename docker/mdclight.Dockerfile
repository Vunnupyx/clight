FROM registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light/mdclight-base:latest

WORKDIR /
# Install compiled MDC light runtime
COPY package.json package.json
RUN npm install

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build
RUN npm run build:dist

RUN mv runtime app
RUN rm -r node_modules && rm -r build

WORKDIR /app

ENV LOG_LEVEL=debug
ENV MDC_LIGHT_FOLDER=/

CMD ["node", "index.js"]