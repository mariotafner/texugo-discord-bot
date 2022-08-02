import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const react_approval_id = '996512018184011908'
const react_antigo_id = '766474508944670743'
const react_novo_id = '1003818108793933886'

require('dotenv').config() //initialize dotenv
import { process_react, process_react_interaction } from './functions/reactFunctions.js'
import { clima } from './functions/catanduvaFunctions.js'

const {
    Client,
    MessageActionRow,
    Intents,
    MessageButton
} = require('discord.js') //import discord.js

const intents = new Intents(Intents.ALL);

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'],
    ws: { intents }
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
    //if (channel.name === '☢react') {
    if (msg.channelId === react_novo_id) {
        if (msg.author.username != 'texugobot') {
            setTimeout(() => {
                process_react(client, msg)
            }, 1000);
        }
    }
}

client.on('messageCreate', msg => {
    process_message(msg)
})

client.on('interactionCreate', interaction => {
    console.log(interaction)
    if (interaction.isButton()) {
        process_react_interaction(client, interaction)
    }
})

client.on('MessageReactionAdd', (action, user) => {
    console.log(action)
});




//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord