FROM arm64v8/node:14.17-alpine3.11

COPY runtime app

ENV LOG_LEVEL=debug

CMD ["node", "app/index.js"]