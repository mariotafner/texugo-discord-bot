import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config() //initialize dotenv

import { image_caption } from './imageCaption.js'
//import { video_caption } from './videoCaption.js'

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGO_URL
const db_client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
db_client.connect(err => {if (err) {console.log(err)}})
const db_approved_react = db_client.db("speedyy").collection("approved_react")

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Attachment,
    ButtonStyle 
} = require('discord.js') //import discord.js

function randon_color() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function url_color(url) {
    let color = '#ffffff'
    if (url == null) return color
    if (url.includes('youtube') || url.includes('youtu.be')) 
        color = '#ff0000'
    else if (url.includes('twitch'))
        color = '#6441a5'
    else if (url.includes('twitter'))
        color = '#1da1f2'
    else if (url.includes('instagram'))
        color = '#e1306c'
    else if (url.includes('facebook'))
        color = '#214796'
    else if (url.includes('tiktok'))
        color = '#000000'
    
    return color
}

function process_url(msg) {
    let words = msg.split(' ')
    let content = ''
    let url = ''

    for (let word of words) {
        if (word.includes('https://')) {
            url = word
        } else {
            content += word + ' '
        }
    }

    return {
        content: content,
        url: url
    }
}

const react_aprovado_id = '996512018184011908'
const react_antigo_id = '766474508944670743'
const react_novo_id = '1003818108793933886'

export async function process_react(client, msg) {
    let { content, url } = process_url(msg.content)

    if (url) {
        resend_react(client, msg, content, url, null)
    }

    let attachments = Array.from(msg.attachments)
    if (attachments.length > 0) {
        for (let attachment of attachments) {
            const url = attachment[1].url
            const filename = attachment[1].name
            resend_react(client, msg, content, null, {
                attachment: url,
                name: filename
            })
        }
    }

    setTimeout(() => {
        msg.delete()
    }, 10);
}

async function resend_react(client, msg, content, url, file){
    let files = []
    const messageEmbed = new EmbedBuilder()
        .setColor(url_color(url))
        .setAuthor({
            name: msg.author.username,
            iconURL: 'https://cdn.discordapp.com/avatars/' + msg.author.id + '/' + msg.author.avatar + '.webp?size=80',
            url: 'https://discord.js.org'
        })
        .setTimestamp()

    if (url) {
        messageEmbed.setURL(url)
        messageEmbed.setTitle(url)
    }
    else if (file){
        content = content.trim()
        
        let is_image = (file.attachment.includes('.png') || file.attachment.includes('.jpg') || file.attachment.includes('.jpeg') || file.attachment.includes('.avif'))
        let is_video = (file.attachment.includes('.mp4') || file.attachment.includes('.mov') || file.attachment.includes('.webm') || file.attachment.includes('.avi') || file.attachment.includes('.mkv') || file.attachment.includes('.flv') || file.attachment.includes('.wmv') || file.attachment.includes('.m4v') || file.attachment.includes('.3gp') || file.attachment.includes('.mpg') || file.attachment.includes('.mpeg') || file.attachment.includes('.m2v') || file.attachment.includes('.m4p') || file.attachment.includes('.m4b') || file.attachment.includes('.m4r') || file.attachment.includes('.m4a') || file.attachment.includes('.aac') || file.attachment.includes('.flac') || file.attachment.includes('.ogg') || file.attachment.includes('.oga') || file.attachment.includes('.mogg') || file.attachment.includes('.opus') || file.attachment.includes('.spx') || file.attachment.includes('.ogv') || file.attachment.includes('.ogx') || file.attachment.includes('.mp3') || file.attachment.includes('.wav') || file.attachment.includes('.wma') || file.attachment.includes('.wv') || file.attachment.includes('.webp') || file.attachment.includes('.gif'))
        is_video = false;

        if (content != '' && is_image) {
            files = [await image_caption(file.attachment, content)]
            content = ''
        }
        else if (content != '' && is_video) {
            let temp = await msg.reply({
                content: 'Aplicando legenda, espere sentado pois isso pode demorar um pouco...',                
                ephemeral: true,
            })

            //await new Promise(r => setTimeout(r, 1000));

            //console.log(temp)
            files = [await video_caption(file.attachment, content)]
            content = ''
            
            delete_message(client, temp.channelId, temp.id)
        }
        else{
            files = [file]
        } 
    }

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(JSON.stringify({
                channel_id: msg.channelId,
                message_id: msg.id,
                action: 'approve'
            }))
            .setLabel('Aprovar')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(JSON.stringify({
                channel_id: msg.channelId,
                message_id: msg.id,
                action: 'delete'
            }))
            .setLabel('Excluir')
            .setStyle(ButtonStyle.Danger),
        );

    if (url){
        row.addComponents(
            new ButtonBuilder()
            .setLabel('Abrir link')
            .setURL(url)
            .setStyle(ButtonStyle.Link)   
        )
    }

    let react_channel = await client.channels.fetch(react_novo_id)

    let tmp = {
        embeds: [messageEmbed],
        files: files,
        components: [row]
    }

    if (content){
        tmp.content = content
    }

    react_channel.send(tmp)
}

async function delete_message(client, channel_id, message_id) {
    const channel = await client.channels.fetch(channel_id)
    channel.messages.fetch(message_id).then(msg => msg.delete()).catch(() => {
        console.log('message not found')
    })
}

async function approved_message(client, msg, action, approver) {
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
        
    const messageEmbed = new EmbedBuilder()
        .setColor(url_color(''))
        .setAuthor({
            name: embed.author.name,
            iconURL: embed.author.iconURL,
            url: 'https://discord.js.org'
        })
        .setTimestamp()

    if (embed)
        if (embed.url){
            messageEmbed.setURL(embed.url)
            messageEmbed.setTitle(embed.title)
            messageEmbed.setColor(url_color(embed.url))
        }

    
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(JSON.stringify({
            action: 'complete'
        }))
        .setLabel('Concluído')
        .setStyle(ButtonStyle.Primary),
    );
    if (embed)
        if (embed.url){
            row.addComponents(
                new ButtonBuilder()
                .setLabel('Abrir link')
                .setURL(embed.url)
                .setStyle(ButtonStyle.Link)   
            )
        }

    if (action === 'approve') {
        messageEmbed.setFooter({
            text: 'Aprovado por: ' + approver
        })

        let react_aprovado_channel = await client.channels.fetch(react_aprovado_id)
        let approved = await react_aprovado_channel.send({
            embeds: [messageEmbed],
            files: files,
            components: [row]
        })

        let inserted = await db_approved_react.insertOne({
            message_id: approved.id,
            approver: approver
        })
    }
    else if (action === 'complete') {
        let react_antigo_channel = await client.channels.fetch(react_antigo_id)
        react_antigo_channel.send({
            embeds: [messageEmbed],
            files: files,
            components: []
        })
    }
}

async function is_mod(member){
    console.log(member)
    return member.roles.cache.some(role => role.name === 'SUB-DONO') || member.roles.cache.some(role => role.name === 'MOD') || is_speedyy(member)
}

function is_owner(interaction){
    let embed = null
    if (interaction.message.embeds.length > 0){
        embed = interaction.message.embeds[0]
    } 
    console.log(interaction.user.username, embed.author.name)
    return interaction.user.username === embed.author.name
}

function is_speedyy(member){
    return member.id === '553399153930272780'
}

function is_mario(member){
    return member.id === '287055431606599680'
}

export async function process_react_interaction(client, interaction){
    const data = JSON.parse(interaction.customId)
    if (data.action === 'approve') {
        if (await is_mod(interaction.member)) {
            await approved_message(client, interaction.message, 'approve', interaction.member.user.username)
            delete_message(client, interaction.message.channelId, interaction.message.id)
        }
        else{
            interaction.reply({
                content: 'Você não tem permissão para aprovar reacts.',                
                ephemeral: true,
            })
        }
    } 
    else if (data.action === 'delete') {
        if (await is_mod(interaction.member) || is_owner(interaction)) {
            delete_message(client, interaction.message.channelId, interaction.message.id)
        }
        else{
            interaction.reply({
                content: 'Você não tem permissão para excluir o react do amiguinho.',                
                ephemeral: true,
            })
        }
    }
    else if (data.action === 'complete') {
        if (is_speedyy(interaction.member) || is_mario(interaction.member)) {
            await approved_message(client, interaction.message, 'complete')
            delete_message(client, interaction.message.channelId, interaction.message.id)
        }
        else{
            interaction.reply({
                content: 'Você não tem permissão para realizar essa ação.',                
                ephemeral: true,
            })
        }
    }
}
