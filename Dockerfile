FROM node:12-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]
