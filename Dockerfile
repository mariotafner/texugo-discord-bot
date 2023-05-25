FROM node:20-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#EXPOSE 3000

CMD ["npm", "start"]

#Excluir container:    docker rm --force texugo-discord-bot
#Criar imagem:         docker build -t texugo-discord-bot .
#Criar container:      docker run -d --name=texugo-discord-bot --restart=always texugo-discord-bot