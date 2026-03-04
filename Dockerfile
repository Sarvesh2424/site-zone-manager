FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm i -g serve

EXPOSE 3000

CMD [ "serve","-s","dist" ]

