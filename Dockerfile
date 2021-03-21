ARG VERSION=14.16.0-buster

FROM node:${VERSION}

WORKDIR /opt/cerealbot

COPY . .

RUN sudo apt-get update && \
    sudo apt-get install ffmpeg && \
    rm -rf /var/lib/apt/lists/* && \
    npm install

USER cerealbot

CMD npm start
