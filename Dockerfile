ARG VERSION=14.16.0-buster

FROM node:${VERSION}

WORKDIR /opt/cerealbot

COPY . .

RUN sudo apt-get install ffmpeg && npm install

CMD npm start
