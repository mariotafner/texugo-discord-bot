import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const react_approval_id = '996512018184011908'
const react_antigo_id = '766474508944670743'
const react_novo_id = '1003818108793933886'

const wait = require('node:timers/promises').setTimeout;

require('dotenv').config() //initialize dotenv
import { process_react, process_react_interaction } from './functions/reactFunctions.js'
import { clima } from './functions/catanduvaFunctions.js'

const {
    Client,
    Intents,
    ButtonBuilder,
    ActionRowBuilder, ModalBuilder, Modal, TextInputBuilder, TextInputStyle, TextInputComponent, InteractionType,
    GatewayIntentBits, Partials, EmbedBuilder, Emoji
} = require('discord.js') //import discord.js

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.MessageContent],
    //intents: 32767,
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
        if (commandName === 'texugosaytext') {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('myModal')
                .setTitle('Mensagem');

            const messageInput = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("Mensagem")
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(messageInput);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }
        else if (commandName === 'texugosay') {
            const message = interaction.options.getString('input');
            
            interaction.channel.send(message)
            interaction.reply({
                content: 'Mensagem enviada!',                
                ephemeral: true,
            })
        }
        else if (commandName === 'catanduva') {
            clima(interaction)
        }
        else if (commandName === 'contator') {
            const messageEmbed = new EmbedBuilder()
                .setColor("#fff")
                .setTitle("Contador 0")
            //let message = await interaction.reply({ embeds: [messageEmbed] })
            let message = await interaction.channel.send({ embeds: [messageEmbed] })
            console.log(message)

            message.react('🔽').then(() => message.react('🔼'))

            interaction.reply({
                content: 'Contador criado!',                
                ephemeral: true,
            })
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

client.on('messageReactionAdd', async (action, user) => {
    if (user === client.user) return;
    console.log(action.emoji.name)
    action.users.remove(user.id);
    let message = await action.message.channel.messages.fetch(action.message.id)
    if (message.embeds){
        let numero = message.embeds[0].title.split(' ')[1]
        console.log(numero)
        if (action.emoji.name === '🔽') {
            numero = parseInt(numero) - 1
            const messageEmbed = new EmbedBuilder()
                .setColor("#fff")
                .setTitle("Contador " + numero)
            message.edit({ embeds: [messageEmbed] })
        }
        else if (action.emoji.name === '🔼') {
            numero = parseInt(numero) + 1
            const messageEmbed = new EmbedBuilder()
                .setColor("#fff")
                .setTitle("Contador " + numero)
            message.edit({ embeds: [messageEmbed] })
        }
    }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord