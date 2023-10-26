FROM node:18-alpine

COPY package.json /app/package.json

WORKDIR /app

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["node", "./dist/index.js"]