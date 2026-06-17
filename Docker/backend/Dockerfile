FROM node
WORKDIR /app

COPY package*.json .
# COPY .env .env
# COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["node", "index.js"]

