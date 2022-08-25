import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {
    Routes,
} = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest');

require('dotenv').config() //initialize dotenv

const commands = [
	new SlashCommandBuilder().setName('catanduva').setDescription('CLima de catanduva'),
	new SlashCommandBuilder().setName('texugosay').setDescription('Texugo irá dizer algo').addStringOption(option => option.setName('input').setDescription('Texto para o bot dizer').setRequired(true)),
	new SlashCommandBuilder().setName('texugosaytext').setDescription('Texugo irá dizer algo'),
	new SlashCommandBuilder().setName('contator').setDescription('Texugo sabe contar'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

console.log(Routes)

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '687250296623202316'), { body: commands })
    .then(() => console.log('Successfully registered guild commands.'))
    .catch(console.error);