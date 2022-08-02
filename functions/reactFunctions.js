import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Attachment
} = require('discord.js') //import discord.js

function randon_color() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function has_url(msg) {
    return msg.includes('https://')
}

const react_aprovado_id = '996512018184011908'
const react_antigo_id = '766474508944670743'
const react_novo_id = '1003818108793933886'

export async function process_react(client, msg) {
    if (has_url(msg.content)) {
        if (msg.embeds.length > 0) {
            resend_react(client, msg, msg.content, msg.embeds[0], null)
        }
        else {
            resend_react(client, msg, msg.content, null, null)
        }
    }

    let attachments = Array.from(msg.attachments)
    if (attachments.length > 0) {
        for (let attachment of attachments) {
            const url = attachment[1].url
            const filename = attachment[1].name
            resend_react(client, msg, null, null, {
                attachment: url,
                name: filename
            })
        }
    }

    setTimeout(() => {
        msg.delete()
    }, 10);
}

async function resend_react(client, msg, url, embed, file){
    let files = []
    const messageEmbed = new MessageEmbed()
        .setColor(randon_color())
        .setAuthor({
            name: msg.author.username,
            iconURL: 'https://cdn.discordapp.com/avatars/' + msg.author.id + '/' + msg.author.avatar + '.webp?size=80',
            url: 'https://discord.js.org'
        })
        .setTimestamp()

    if (url) {
        if (embed) {
            console.log(embed)
            try {
                messageEmbed.setURL(embed.url)
                messageEmbed.setThumbnail(embed.thumbnail.url)
            } catch (e) {
                messageEmbed.setURL(msg.content)
                console.log(e)
            }

            try {
                messageEmbed.setTitle(embed.title)
            } catch (e) {
                try {
                    messageEmbed.setTitle(embed.description)
                } catch (e) {
                    messageEmbed.setTitle(msg.content)
                    console.log(e)
                }
                console.log(e)
            }    
        }
        else {
            messageEmbed.setURL(msg.content)
            messageEmbed.setTitle(msg.content)
        }
    }
    else if (file){
        files = [file]
    }

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(JSON.stringify({
                channel_id: msg.channelId,
                message_id: msg.id,
                action: 'approve'
            }))
            .setLabel('Aprovar')
            .setStyle('SUCCESS'),

            new MessageButton()
            .setCustomId(JSON.stringify({
                channel_id: msg.channelId,
                message_id: msg.id,
                action: 'delete'
            }))
            .setLabel('Excluir')
            .setStyle('DANGER'),
        );

    let react_channel = await client.channels.fetch(react_novo_id)
    react_channel.send({
        embeds: [messageEmbed],
        files: files,
        components: [row]
    })
}

async function delete_message(client, channel_id, message_id) {
    const channel = await client.channels.fetch(channel_id)
    channel.messages.fetch(message_id).then(msg => msg.delete()).catch(() => {
        console.log('message not found')
    })
    console.log(channel_id, message_id)
}

async function approve_message(client, msg) {
    let react_aprovado_channel = await client.channels.fetch(react_aprovado_id)
    
    let files = []
    let attachments = Array.from(msg.attachments)
    if (attachments.length > 0) {
        for (let attachment of attachments) {
            const url = attachment[1].url
            const filename = attachment[1].name

            files.push({
                attachment: url,
                name: filename
            })
        }
    }

    let embed = null
    if (msg.embeds.length > 0){
        embed = msg.embeds[0]
    } 
        
    const messageEmbed = new MessageEmbed()
        .setColor(randon_color())
        .setAuthor({
            name: embed.author.name,
            iconURL: embed.author.iconURL,
            url: 'https://discord.js.org'
        })
        .setTimestamp()

    console.log(embed)
    if (embed.url){
        messageEmbed.setURL(embed.url)
        messageEmbed.setThumbnail(embed.thumbnail.url)
        messageEmbed.setTitle(embed.title)
    }

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId(JSON.stringify({
            action: 'delete'
        }))
        .setLabel('Concluído')
        .setStyle('PRIMARY'),
    );


    react_aprovado_channel.send({
        embeds: [messageEmbed],
        files: files,
        components: [row]
    })
}

async function is_mod(client, interaction){
    console.log(interaction)
    //let user = await client.users.fetch(interaction.user_id)
    //console.log(user)
    return interaction.member.roles.cache.some(role => role.name === 'SUB-DONO') || interaction.member.roles.cache.some(role => role.name === 'MOD') || interaction.member.id === '553399153930272780'
}

function is_owner(interaction){
    let embed = null
    if (interaction.message.embeds.length > 0){
        embed = interaction.message.embeds[0]
    } 
    console.log(interaction.user.username, embed.author.name)
    return interaction.user.username === embed.author.name
}

export async function process_react_interaction(client, interaction){
    const data = JSON.parse(interaction.customId)
    if (data.action === 'approve') {
        if (await is_mod(client, interaction)) {
            approve_message(client, interaction.message)
            delete_message(client, interaction.message.channelId, interaction.message.id)
        }
    } else if (data.action === 'delete') {
        if (await is_mod(client, interaction) || is_owner(interaction)) {
            delete_message(client, interaction.message.channelId, interaction.message.id)
        }
    }
}
