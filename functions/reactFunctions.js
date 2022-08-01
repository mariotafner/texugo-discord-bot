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

const react_approval_id = '996512018184011908'

export async function process_react(client, msg) {
    let send = false
    let content = ''
    let embed = {}
    let content_has_url = false

    let react_approvals = await client.channels.fetch(react_approval_id)

    if (has_url(msg.content)) {
        content += 'Conteúdo: ' + msg.content + '\n'

        if (msg.embeds.length > 0) {
            embed = msg.embeds[0]
        }
        content_has_url = true
        send = true
    }

    let attachments = Array.from(msg.attachments)
    let files_list = []
    if (attachments.length > 0) {
        send = true
        for (let attachment of attachments) {
            const url = attachment[1].url
            const filename = attachment[1].name

            files_list.push({
                attachment: url,
                name: filename
            })
        }
    }

    const messageEmbed = new MessageEmbed()
        .setColor(randon_color())
        .setAuthor({
            name: msg.author.username,
            iconURL: 'https://cdn.discordapp.com/avatars/' + msg.author.id + '/' + msg.author.avatar + '.webp?size=80',
            url: 'https://discord.js.org'
        })
        .setTimestamp()


    if (content_has_url) {
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
            .setLabel('Reprovar')
            .setStyle('DANGER'),

            new MessageButton()
            .setLabel('Ver Mensagem')
            .setURL(msg.url)
            .setStyle('LINK'),
        );

    if (send)
        react_approvals.send({
            embeds: [messageEmbed],
            files: files_list,
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

async function approve_message(client, channel_id, message_id) {
    const channel = await client.channels.fetch(channel_id)
    channel.messages.fetch(message_id).then(msg => msg.react('👍')).catch(() => {
        console.log('message not found')
    })
    console.log(channel_id, message_id)
}

export function process_react_interaction(client, interaction){
    const data = JSON.parse(interaction.customId)
    if (data.action === 'approve') {
        approve_message(client, data.channel_id, data.message_id)
        delete_message(client, interaction.message.channelId, interaction.message.id)
    } else if (data.action === 'delete') {
        delete_message(client, data.channel_id, data.message_id)
        delete_message(client, interaction.message.channelId, interaction.message.id)
    }
}
