require('dotenv').config(); //initialize dotenv
const { Client, Intents } = require('discord.js'); //import discord.js

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); //create new client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log(msg);
  if (msg.content === '!texugobot') {
    msg.reply('oi');
  }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord
