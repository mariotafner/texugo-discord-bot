import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {
    Routes,
} = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest');

require('dotenv').config() //initialize dotenv

const commands = [
	new SlashCommandBuilder().setName('catanduva').setDescription('Clima de catanduva'),
	new SlashCommandBuilder().setName('texugosay').setDescription('Texugo irá dizer algo').addStringOption(option => option.setName('input').setDescription('Texto para o bot dizer').setRequired(true)),
	new SlashCommandBuilder().setName('texugosaytext').setDescription('Texugo irá dizer algo'),
	new SlashCommandBuilder().setName('contator').setDescription('Texugo sabe contar'),
	new SlashCommandBuilder().setName('texugofrase').setDescription('Texugo irá dizer algo de maneira estilosa').addStringOption(option => option.setName('input').setDescription('Texto para o bot dizer').setRequired(true)),
	new SlashCommandBuilder().setName('texugoimagine').setDescription('Texugo irá imaginar a sua frase').addStringOption(option => option.setName('input').setDescription('Frase para o bot desenhar').setRequired(true)),
	new SlashCommandBuilder().setName('twitchinfo').setDescription('Texugo irá dizer sobre um usuário da twitch').addStringOption(option => option.setName('input').setDescription('Informe um usuário da twitch').setRequired(true)),
	new SlashCommandBuilder().setName('gpt').setDescription('Texugo irá incorporar o Chat GPT').addStringOption(option => option.setName('input').setDescription('Informe sua pergnta').setRequired(true)),
	new SlashCommandBuilder().setName('editimage').setDescription('Texugo irá editar a imagem em anexo com a descrição informada').addAttachmentOption(option => option.setName('image').setDescription('Imagem para editar').setRequired(true)).addStringOption(option => option.setName('input').setDescription('Texto para o bot editar a imagem').setRequired(true)),
	new SlashCommandBuilder().setName('streamsummary').setDescription('Texugo irá gerar um resumo da stream'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

console.log(Routes)

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '687250296623202316'), { body: commands })
//     .then(() => console.log('Successfully registered guild commands.'))
//     .catch(console.error);