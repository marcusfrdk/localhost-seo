FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8053
CMD ["npm", "run", "start"]