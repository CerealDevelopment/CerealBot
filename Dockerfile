ARG VERSION=14.16.0-buster

FROM node:${VERSION}

WORKDIR /opt/cerealbot

COPY . .

RUN useradd -ms /bin/bash cerealbot && \
    apt-get update -y && \
    apt-get install ffmpeg -y && \
    rm -rf /var/lib/apt/lists/*

USER cerealbot

ENV BOT_TOKEN=""

RUN npm ci && \
    npm run build

CMD npm start
