require('dotenv').config() //initialize dotenv
const { Client, Intents, Attachment, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js') //import discord.js

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }) //create new client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const react_approval_id = '996512018184011908'

function randon_color() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

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
      .setColor(randon_color())
      .setAuthor({ 
        name: msg.author.username, 
        iconURL: 'https://cdn.discordapp.com/avatars/'+msg.author.id+'/'+msg.author.avatar+'.webp?size=80', 
        url: 'https://discord.js.org'})
      .setTimestamp()

  
    if (content_has_url) {
      console.log(embed)
      try{
        messageEmbed.setURL(embed.url)
        messageEmbed.setThumbnail(embed.thumbnail.url)
      }
      catch(e){
        messageEmbed.setURL(msg.content)
        console.log(e)
      }

      try{
        messageEmbed.setTitle(embed.title)   
      }
      catch(e){
        try{
          messageEmbed.setTitle(embed.description)
        }
        catch(e){
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
  setTimeout(() => {
    process_message(msg)
  }, 5000);
})

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return
	console.log(interaction)
  delete_message(interaction.message.channelId, interaction.message.id)
  console.log(interaction.customId)
  const data = JSON.parse(interaction.customId)
  if (data.action === 'approve') {
    approve_message(data.channel_id, data.message_id)
  }
  else if (data.action === 'delete') {
    delete_message(data.channel_id, data.message_id)
  }
})

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN) //login bot using token

//https://buddy.works/tutorials/how-to-build-a-discord-bot-in-node-js-for-beginners#step-1-create-an-app-in-discord
