FROM node:17-alpine

WORKDIR /app

COPY . .

RUN npm install --force

EXPOSE 4000

CMD ["npm", "run","dev"]