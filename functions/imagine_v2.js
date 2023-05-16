import fetch from "node-fetch";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config() //initialize dotenv

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export async function imagine(text, update_function) {
    update_function('Autenticando...')
    const {
        Configuration,
        OpenAIApi
    } = require("openai");

    const configuration = new Configuration({
        apiKey: process.env.GPT_TOKEN,
    });
    const openai = new OpenAIApi(configuration);

    update_function('Gerando imagem...')
    const response = await openai.createImage({
        prompt: text,
        n: 4,
        size: "1024x1024",
    });
    let image_url = response.data.data;
    console.log(image_url);

    update_function("Anexando imagem...")

    return image_url
}