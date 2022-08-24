import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
    EmbedBuilder,
} = require('discord.js') //import discord.js

require('dotenv').config() //initialize dotenv
import fetch from 'node-fetch';

function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

export async function clima(msg){
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+process.env.LAT+'&lon='+process.env.LON+'&appid='+process.env.WEATHER_API_KEY+'&lang=pt_br');
    const data = await response.json();

    const { EmbedBuilder } = require('discord.js');

    const messageEmbed = new EmbedBuilder()
        .setColor(0xEC6E4C)
        .setTitle('Catanduva SP | ' + kelvinToCelsius(data.main.temp) + '°C')
        //.setURL('https://discord.js.org/')
        //.setAuthor({ name: 'Catanduva SP', iconURL: 'https://openweathermap.org/img/wn/'+data.+'@2x.png', url: 'https://discord.js.org' })
        .setDescription(capitalize(data.weather[0].description))
        .setThumbnail('https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png')
        .addFields(
            { name: 'Temperatura', value: kelvinToCelsius(data.main.temp) + '°C', inline: true  },
            //{ name: 'Sensação Térmica', value: kelvinToCelsius(data.main.feels_like) + '°C', inline: true  },
            //{ name: 'Mínima', value: kelvinToCelsius(data.main.temp_min) + '°C', inline: true },
            //{ name: 'Máxima', value: kelvinToCelsius(data.main.temp_max) + '°C', inline: true },
            { name: 'Umidade', value: data.main.humidity + "%", inline: true },
            { name: 'Vento', value: Math.round(data.wind.speed * 3.6) + ' km/h', inline: true },
        )
        
        .setImage('https://images.adsttc.com/media/images/58c7/6057/e58e/ce3e/6900/00ac/medium_jpg/15271-bg-pcasCatanduva-0081-alta.jpg?1489461305')
        .setTimestamp()
        .setFooter({ text: 'Desenvolvido com ♥ por mariofabre', iconURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6cc4fbc4-5da2-4321-8876-5ac0d106d777-profile_image-70x70.png' });

    //msg.channel.send({ embeds: [messageEmbed] });
    msg.reply({ embeds: [messageEmbed] });
}
