ARG VERSION=16.13-buster-slim
FROM node:${VERSION}
ENV NODE_ENV production
ENV BOT_TOKEN=""

WORKDIR /opt/cerealbot

RUN useradd -ms /bin/bash cerealbot && \
    apt-get update -y && \
    apt-get install ffmpeg libc6 -y && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=cerealbot:cerealbot . /opt/cerealbot

RUN npm install --only=production --ignore-scripts

USER cerealbot

CMD npm start
