FROM freecoder/editly:latest
FROM node:20-alpine3.16

WORKDIR /app

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      ffmpeg \
      python3 \
      yarn

COPY package*.json ./
RUN find /usr/lib -type d -name "node-gyp" -exec sh -c 'cd "$(dirname "{}")" && npm i node-gyp@latest' \;

RUN apk update
RUN apk add vips-dev

#RUN npm i -g editly

RUN npm install

COPY . .

#EXPOSE 3000

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v13.5.0 works with Chromium 100.
RUN yarn add puppeteer@13.5.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

CMD ["npm", "start"]

#Excluir container:    docker rm --force texugo-discord-bot
#Criar imagem:         docker build -t texugo-discord-bot .
#Criar container:      docker run -d --name=texugo-discord-bot --restart=always texugo-discord-bot