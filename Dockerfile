FROM node:16
WORKDIR /usr/src/app
COPY package.json .
RUN npm install\
 && npm install tsc -g
COPY . /usr/src/service
RUN tsc tsconfig.prod.json
CMD ["node", "./dist/index.js"]
