FROM node:18
WORKDIR /jstiburek/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["node", "dist/main"]