ARG VERSION=14.16.0-buster
FROM node:${VERSION}
ENV NODE_ENV production
ENV BOT_TOKEN=""

WORKDIR /opt/cerealbot

COPY . /opt/cerealbot

RUN useradd -ms /bin/bash cerealbot && \
    apt-get update -y && \
    apt-get install ffmpeg -y && \
    rm -rf /var/lib/apt/lists/* && \
    chown -R cerealbot /opt/cerealbot

USER cerealbot
RUN npm ci --only=production

CMD npm start
