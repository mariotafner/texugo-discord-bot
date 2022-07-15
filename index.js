require('dotenv').config() //initialize dotenv
const { Client, Intents, Attachment, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js') //import discord.js

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }) //create new client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const react_approval_id = '996512018184011908'

function has_url(msg) {
  return msg.includes('https://')
}

async function process_message(msg) {
  console.log(msg)
  if (msg.content === '!texugobot') {
    msg.reply('oi')
  }

  let channel = await client.channels.fetch(msg.channelId)
  if (channel.name === '☢react') {
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

    attachments = Array.from(msg.attachments)
    files_list = []
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
      .setColor('#0099ff')
      .setAuthor({ 
        name: msg.author.username, 
        iconURL: 'https://cdn.discordapp.com/avatars/'+msg.author.id+'/'+msg.author.avatar+'.webp?size=80', 
        url: 'https://discord.js.org'})
      .setTimestamp()

  
    if (content_has_url) {
      console.log(embed)
      messageEmbed.setTitle(embed.title)
      messageEmbed.setURL(embed.url)
      messageEmbed.setThumbnail(embed.thumbnail.url)
    }
    
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('aprovar_'+msg.id+'-'+msg.channelId)
					.setLabel('Aprovar')
					.setStyle('SUCCESS'),
			)
      .addComponents(
				new MessageButton()
					.setCustomId('reprovar_'+msg.id+'-'+msg.channelId)
					.setLabel('Reprovar')
					.setStyle('DANGER'),
			)
    if (send)
      react_approvals.send({ embeds: [messageEmbed], files: files_list, components: [row] })
  }
}

async function delete_message(channel_id, message_id){
  const channel = await client.channels.fetch(channel_id)
  channel.messages.fetch(message_id).then(msg => msg.delete()).catch(() => {console.log('message not found')})
  console.log(channel_id, message_id)
}

async function approve_message(channel_id, message_id){
  const channel = await client.channels.fetch(channel_id)
  channel.messages.fetch(message_id).then(msg => msg.react('👍')).catch(() => {console.log('message not found')})
  console.log(channel_id, message_id)
}

client.on('messageCreate', msg => {
  process_message(msg)
})

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return
	console.log(interaction)
  delete_message(interaction.message.channelId, interaction.message.id)
  if (interaction.customId.startsWith('reprovar_')) {
    let message_id = interaction.customId.split('_')[1].split('-')[0]
    let channel_id = interaction.customId.split('-')[1]
    delete_message(channel_id, message_id)
  }
  else if (interaction.customId.startsWith('aprovar_')) {
    let message_id = interaction.customId.split('_')[1].split('-')[0]
    let channel_id = interaction.customId.split('-')[1]
    approve_message(channel_id, message_id)
  }
})

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord
