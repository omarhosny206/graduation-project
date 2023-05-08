FROM node:16

WORKDIR /app

COPY package*.json .

RUN npm run build

COPY . .

ENV PORT=8080

EXPOSE $PORT

CMD ["npm", "start"]