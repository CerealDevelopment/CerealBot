ARG VERSION=14.16.0-buster

FROM node:${VERSION}

WORKDIR /opt/cerealbot

COPY . .

RUN npm install

CMD npm start
