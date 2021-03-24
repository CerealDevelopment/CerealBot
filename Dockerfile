ARG VERSION=14.16.0-buster

FROM node:${VERSION}

WORKDIR /opt/cerealbot

COPY . .

RUN useradd -ms /bin/bash cerealbot && \
    apt-get update -y && \
    apt-get install ffmpeg -y && \
    rm -rf /var/lib/apt/lists/* && \
    npm install

USER cerealbot

CMD npm start
