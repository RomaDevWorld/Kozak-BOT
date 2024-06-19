FROM node:20-alpine

COPY package.json /app/package.json
COPY yarn.lock ./app/yarn.lock

WORKDIR /app

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["node", "./dist/index.js"]