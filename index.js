import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config() //initialize dotenv
import { process_react, process_react_interaction } from './functions/reactFunctions.js'
import { clima } from './functions/catanduvaFunctions.js'

const {
    Client,
    Intents
} = require('discord.js') //import discord.js

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
}) //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

async function process_message(msg) {
    console.log(msg)
    if (msg.content === '!texugobot') {
        msg.reply('oi')
    }
    else if (msg.content === '!texugobot help') {
        msg.reply('Em breve!')
    }
    else if (msg.content === '!catanduva') {
        clima(msg)
    }

    let channel = await client.channels.fetch(msg.channelId)
    if (channel.name === '☢react') {
        setTimeout(() => {
            process_react(client, msg)
        }, 5000);
    }
}

client.on('messageCreate', msg => {
    process_message(msg)
})

client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return
    console.log(interaction)
    process_react_interaction(client, interaction)
})

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord