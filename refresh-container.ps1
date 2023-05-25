docker rm --force texugo-discord-bot
docker build -t texugo-discord-bot .
docker run -d --name=texugo-discord-bot --restart=always texugo-discord-bot