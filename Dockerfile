FROM mcr.microsoft.com/devcontainers/javascript-node:0-20
ENV NODE_ENV=production
WORKDIR /project
COPY /project/package.json /project/package-lock.json ./
COPY /project/build ./build
COPY /project/server.js ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]