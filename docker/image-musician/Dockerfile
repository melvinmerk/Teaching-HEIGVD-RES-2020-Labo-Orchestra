FROM node:15.13.0

COPY src/ /opt/app

WORKDIR /opt/app

RUN npm install

ENTRYPOINT ["node", "musician.js"]
