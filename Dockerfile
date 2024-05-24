FROM node:18

WORKDIR /app

COPY package*.json ./

# Set NPM registry to use HTTP
RUN npm config set registry http://registry.npmjs.org/

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
