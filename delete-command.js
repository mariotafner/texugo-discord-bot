import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {
    Routes,
} = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest');

require('dotenv').config() //initialize dotenv


const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, '1032087800574660730'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);

// rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, '687250296623202316', '1012135324991893585'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);