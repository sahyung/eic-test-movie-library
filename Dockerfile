FROM node:19.4-alpine

WORKDIR /app
COPY package*.json .

RUN npm install
COPY . .

EXPOSE 3300
CMD ["npm", "run", "dev"]
