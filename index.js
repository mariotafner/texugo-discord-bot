import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const react_approval_id = '996512018184011908'
const react_antigo_id = '766474508944670743'
const react_novo_id = '1003818108793933886'

const wait = require('node:timers/promises').setTimeout;

require('dotenv').config() //initialize dotenv
import { process_react, process_react_interaction } from './functions/reactFunctions.js'
import { clima } from './functions/catanduvaFunctions.js'
import { image_text } from './functions/sendImage.js'
import { startLoadingMessage } from './functions/loadingMessage.js'
import { imagine } from './functions/imagine_v2.js'
import { user_info } from './functions/userInfo.js'
import { gpt } from './functions/gpt.js'
import { stream_summary } from './functions/streamSummary.js';

const {
    Client,
    Intents,
    ButtonBuilder,ButtonStyle,
    ActionRowBuilder, ModalBuilder, Modal, TextInputBuilder, TextInputStyle, TextInputComponent, InteractionType, StringSelectMenuBuilder,
    GatewayIntentBits, Partials, EmbedBuilder, Emoji, UserSelectMenuBuilder, StringSelectMenuOptionBuilder
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
    //console.log(msg)
    console.log(msg.channel.name + ' | ' + msg.author.username + ': ' + msg.content)
    if (msg.author.username != 'texugobot'){
        if (msg.content.includes('!catanduva')) {
            msg.reply('O comando !catanduva foi descontinuado, utilize /catanduva')
        }
        if (msg.channelId === react_novo_id) {
            setTimeout(() => {
                process_react(client, msg)
            }, 500);
        }
        if (msg.content.startsWith('!texugoimg')) {
            let attachments = Array.from(msg.attachments)
            if (attachments.length > 0) {
                for (let attachment of attachments) {
                    const url = attachment[1].url
                    const filename = attachment[1].name
                    
                    msg.channel.send({
                        files: [{
                            attachment: url,
                            name: filename
                        }]
                    })
                }
            }
            msg.delete()
        }
    }
    else{
        //startLoadingMessage(msg)
    }
}

client.on('messageCreate', msg => {
    process_message(msg)
})

client.on('interactionCreate', async interaction => {
    console.log(interaction)

    async function process_imagine(interaction, prompt = null){
        const modal = new ModalBuilder()
            .setCustomId('modal_imagine')
            .setTitle('Insira os dados para a imagem');

        const promptInput = new TextInputBuilder()
            .setCustomId('prompt')
            .setLabel("Prompt")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // const orientationInput = new StringSelectMenuBuilder()
        //     .setCustomId('orientation')
        //     .setPlaceholder('Orientação da imagem')
        //     .addOptions(
        //         new StringSelectMenuOptionBuilder()
        //             .setLabel('Retrato')
        //             .setValue('portrait'),
        //         new StringSelectMenuOptionBuilder()
        //             .setLabel('Quadrado')
        //             .setValue('square'),
        //         new StringSelectMenuOptionBuilder()
        //             .setLabel('Paisagem')
        //             .setValue('landscape'),
        //     );

        const firstActionRow = new ActionRowBuilder().addComponents(promptInput);
        // const secondActionRow = new ActionRowBuilder().addComponents(orientationInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        /*let message = ''
        if (prompt){
            message = prompt
        }
        else{
            message = interaction.options.getString('input');
        }

        let orientation = interaction.options.getString('orientation');

        await interaction.reply('Carregando...')

        try{
            function updateReply(status){
                interaction.editReply({ content: status })
            }
            
            let imgs = await imagine(message, orientation, updateReply)
            
            if (imgs){
                let i = 0
                let send_img = []
                for (let img of imgs) {
                    let filename = message.replace(',', '').replace(' ', '_') + '_' + i + '.png'
                    send_img.push({
                        attachment: img.url,
                        name: filename
                    })
                    i++
                }
                interaction.channel.send({
                    files: send_img
                })
                interaction.editReply({ content: message })
            }
            else{
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('imagine:' + message)
                        .setLabel('Tentar novamente')
                        .setStyle(ButtonStyle.Danger),
                    );
                
                interaction.editReply({ content: 'Não foi possível gerar a imagem', components: [row] })
            }
        }
        catch(err){
            console.log(err)
        }*/
    }

    if (interaction.isButton()) {
        const data = interaction.customId
        console.log(data)
        if (data.startsWith('imagine')) {
            //let prompt = data.split(':')[1]
            process_imagine(interaction)
        }
        else {
            process_react_interaction(client, interaction)
        }
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
        else if (commandName === 'texugofrase'){
            const message = interaction.options.getString('input');
            await interaction.reply('Carregando...')

            interaction.editReply({ content: '', files: [await image_text(message)] })
        }
        else if (commandName === 'texugoimagine'){
            process_imagine(interaction)
        }
        else if (commandName === 'twitchinfo'){
            const username = interaction.options.getString('input');
            console.log(username)
            interaction.reply('Carregando...')

            let embed = null
            function callback(data){
                if (data.loading){
                    embed = new EmbedBuilder()
                        .setColor(data.color)
                        .setAuthor({
                            name: data.username,
                            iconURL: data.profile,
                            url: 'https://twitch.tv/' + data.username
                        })
                        .addFields(
                            {
                                name: 'Qtd. de mensagens',
                                value: String(data.qtd),
                                inline: true
                            },
                            {
                                name: "Primeira mensagem",
                                value: new Date(data.first_message).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                                inline: true
                            }
                        )
                }
                if (data.loading)
                    interaction.editReply({ embeds: [embed], content: 'Carregando...' })
                else
                    interaction.editReply({ embeds: [embed], content: '' })

            }

            user_info(username, callback)
        }
        else if (commandName === 'gpt'){
            interaction.reply('Carregando...')
            const prompt = interaction.options.getString('input');
            const response = await gpt(prompt)
            console.log(response)
            interaction.editReply(response)
        }
        else if (commandName === 'editimage'){
            const prompt = interaction.options.getString('input');
            const image = interaction.options.getAttachment('image');
            await interaction.reply(prompt + ' (Carregando...)')

            try{
                function updateReply(status){
                    interaction.editReply({ content: status })
                }

                const axios = require('axios')
                const response = await axios.post("http://aquelelink:5000/edit", {
                    prompt: prompt,
                    url: image.attachment
                })
                console.log(response.data)


                let send_img = []
                //let filename = prompt.replace(',', '').replace(' ', '_') + '.png'

                send_img.push({
                    attachment: image.attachment,
                })

                send_img.push({
                    attachment: "http://aquelelink:5000/images/" + response.data.id + ".png",
                })

                interaction.channel.send({
                    files: send_img
                })
                interaction.editReply({ content: prompt })
            }
            catch(err){
                console.log(err)
            }
        }
        else if (commandName === 'streamsummary'){
            
            await interaction.reply('Veja alguns detalhes da última live em (beta): https://texugolivre.vercel.app/stream_summary')

            //interaction.editReply({ content: '', files: [await stream_summary()] })
        }
    }

    if (interaction.type === InteractionType.ModalSubmit){
        if (interaction.customId === 'myModal') {
            // Get the data entered by the user
            const message = interaction.fields.getTextInputValue('message');
            interaction.deferUpdate()
            interaction.channel.send(message)
        }
        else if (interaction.customId === 'modal_imagine') {
            function getEmbed(done, step, imgs, prompt, interaction = null){
                const messageEmbed = new EmbedBuilder()
                    .setColor(done ? "#3ba55c" : "#ffd91d")
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar + '.webp?size=80',
                        url: 'https://discord.js.org'
                    })
                    // .setTimestamp()
                    .setTitle(prompt)
                
                if (!done){
                    messageEmbed.setDescription(step)
                }
                else {
                    messageEmbed.setFooter({
                        text: 'Use /texugoimagine para gerar uma imagem',
                    })
                }
                    

                let tmp = {
                    embeds: [messageEmbed],
                }

                if (imgs){
                    tmp.files = imgs
                }

                return tmp
            }

            let prompt = interaction.fields.getTextInputValue('prompt');

            interaction.deferUpdate()


            

            let message = await interaction.channel.send(getEmbed(false, 'Carregando...', null, prompt, interaction))

            try{
                function updateReply(status){
                    message.edit(getEmbed(false, status, null, prompt, interaction))
                }
                
                let imgs = await imagine(prompt, 'landscape', updateReply)
                
                if (imgs){
                    // let i = 0
                    // let send_img = []
                    // for (let img of imgs) {
                    //     let filename = prompt.replace(',', '').replace(' ', '_') + '_' + i + '.png'
                    //     send_img.push({
                    //         attachment: img.url,
                    //         name: filename
                    //     })
                    //     i++
                    // }

                    
                    
                    message.edit(getEmbed(true, prompt, [{
                        attachment: imgs[0].url,
                        name: prompt.replace(',', '').replace(' ', '_') + '.png'
                    }], prompt, interaction))
                }
                else{
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('imagine:' + prompt)
                            .setLabel('Tentar novamente')
                            .setStyle(ButtonStyle.Danger),
                        );
                    
                    message.edit({ content: 'Não foi possível gerar a imagem', components: [row] })
                }
            }
            catch(err){
                console.log(err)
            }
        }
    }
})

client.on('messageReactionAdd', async (action, user) => {
    if (user === client.user) return;
    console.log(action.emoji.name)
    
    let message = await action.message.channel.messages.fetch(action.message.id)
    if (message.embeds.length){
        let numero = message.embeds[0].title.split(' ')[1]
        console.log(numero)
        if (action.emoji.name === '🔽') {
            action.users.remove(user.id);
            numero = parseInt(numero) - 1
            const messageEmbed = new EmbedBuilder()
                .setColor("#fff")
                .setTitle("Contador " + numero)
            message.edit({ embeds: [messageEmbed] })
        }
        else if (action.emoji.name === '🔼') {
            action.users.remove(user.id);
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

// redeploy ////