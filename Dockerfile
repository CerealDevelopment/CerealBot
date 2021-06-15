ARG VERSION=14.16.0-buster
FROM node:${VERSION}
ENV NODE_ENV production
ENV BOT_TOKEN=""

WORKDIR /opt/cerealbot

RUN useradd -ms /bin/bash cerealbot && \
    apt-get update -y && \
    apt-get install ffmpeg -y && \
    rm -rf /var/lib/apt/lists/*

COPY . /opt/cerealbot

RUN npm install --only=production

RUN chown -R cerealbot /opt/cerealbot

USER cerealbot

CMD npm start
