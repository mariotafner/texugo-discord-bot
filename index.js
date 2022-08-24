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
    Intents,
    ButtonBuilder,
    ActionRowBuilder, ModalBuilder, Modal, TextInputBuilder, TextInputStyle, TextInputComponent, InteractionType,
    GatewayIntentBits, Partials 
} = require('discord.js') //import discord.js



const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.MessageContent,],
    partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.User]
}) //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

async function process_message(msg) {
    console.log(msg)
    if (msg.author.username != 'texugobot'){
        if (msg.content.includes('!catanduva')) {
            msg.reply('O comando !catanduva foi descontinuado, utilize /catanduva')
        }
        if (msg.channelId === react_novo_id) {
            setTimeout(() => {
                process_react(client, msg)
            }, 1000);
        }
    }


}

client.on('messageCreate', msg => {
    process_message(msg)
})

client.on('interactionCreate', async interaction => {
    console.log(interaction)
    if (interaction.isButton()) {
        process_react_interaction(client, interaction)
    }

    if (interaction.isCommand()){
        const { commandName } = interaction;
        if (commandName === 'texugosay') {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('myModal')
                .setTitle('My Modal');

            // Add components to modal

            // Create the text input components
            const messageInput = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("Mensagem")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new ActionRowBuilder().addComponents(messageInput);

            // Add inputs to the modal
            modal.addComponents(firstActionRow);

            // Show the modal to the user
            await interaction.showModal(modal);
        }
        if (commandName === 'catanduva') {
            clima(interaction)
        }
    }

    if (interaction.type === InteractionType.ModalSubmit){
        // Get the data entered by the user
	    const message = interaction.fields.getTextInputValue('message');
        interaction.deferUpdate()
        let channel = await client.channels.fetch(interaction.channelId)
        channel.send(message)
    }

	
})

client.on('MessageReactionAdd', (action, user) => {
    console.log(action)
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord