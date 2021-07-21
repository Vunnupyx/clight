FROM arm32v7/node:12.18.3-alpine3.9

COPY dist app

CMD ["node", "app/index.js"]