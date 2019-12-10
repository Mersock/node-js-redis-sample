FROM node:13.3-alpine

WORKDIR /usr/app/

COPY ./package.json .

RUN npm install 

COPY . .

CMD ["npm","start"]