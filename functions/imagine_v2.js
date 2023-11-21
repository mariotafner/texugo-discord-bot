import fetch from "node-fetch";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config() //initialize dotenv

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function random_phrase(){
    const phrases = [
        "Preparando a mágica! Em breve, a sua imagem brilhará como uma estrela. ✨🎩",
        "Paciência, jovem padawan! Estamos forjando a sua imagem com a força da diversão. 🌟🚀",
        "Segura a ansiedade! Estamos cozinhando a sua imagem com tempero de alegria. 🍳😄",
        "Elevando a expectativa! Sua imagem está a caminho. 🌈😃",
        "Prepare-se para o espetáculo visual! Estamos afinando cada pixel para a sua apreciação. 🎨🌟",
        "Segurando a respiração? Logo soltaremos a sua imagem. 🎉🖼️",
        "Estamos no forno da criatividade! Em breve, sua imagem sairá quentinha e deliciosa. 🍪🖼️",
        "Aguarde o show de luzes e cores! Sua imagem está prestes a se revelar. 🎆🌠",
        "A contagem regressiva começou! Sua imagem está prestes a desfilar na passarela. 💃🎉",
        "Chamando todos os fãs da diversão! Sua imagem está prestes a dar o ar da graça. 🎈😁",
        "Segura o Pikachu! Estamos carregando sua imagem com a energia contagiante. ⚡🎮",
        "Aguardando a nave mãe! Sua imagem vai aterrissar no planeta como um ET. 🛸👽",
        "Abracadabra, hocus pocus! Sua imagem está prestes a aparecer como um truque de mágica digno de Hogwarts. 🧙‍♂️📜",
        "Chama o Homem-Aranha! Sua imagem vai balançar na teia com estilo aracnídeo. 🕷️🎨",
        "Prepare-se para o salto quântico da diversão! Sua imagem vai transcender dimensões como um super-herói. 🦸‍♂️🚀",
        "Sintonize na rádio da alegria! Sua imagem vai tocar como um hit pop nas paradas visuais. 🎤🎉",
        "Atenção, tripulação! Sua imagem está prestes a decolar na nave espacial. 🚀🌌",
        "Invocando o espírito do Gênio da lâmpada! Sua imagem vai realizar desejos visuais com uma pitada de magia. 🧞‍♂️✨",
        "Que a força esteja com você! Sua imagem vai brilhar como um sabre de luz na galáxia. ⚔️🌌",
        "Aguardando a carta de aceitação para Hogwarts! Sua imagem vai entrar na escola como um bruxo em treinamento. 🦉🔮"
    ]

    return phrases[Math.floor(Math.random() * phrases.length)]
}

export async function imagine(text, orientation, update_function) {
    let resolution = '1024x1024'
    if (orientation == 'square') {
        resolution = '1024x1024'
    }
    else if (orientation == 'portrait') {
        resolution = '1024x1792'
    }
    else if (orientation == 'landscape') {
        resolution = '1792x1024'
    }

    update_function('Autenticando...')
    const {
        Configuration,
        OpenAIApi
    } = require("openai");

    const configuration = new Configuration({
        apiKey: process.env.GPT_TOKEN,
    });
    const openai = new OpenAIApi(configuration);

    update_function(random_phrase())

    try {
        const response = await openai.createImage({
            model: "dall-e-3",
            prompt: text,
            n: 1,
            size: resolution,
            quality: "hd",
        });
        let image_url = response.data.data;
        console.log(image_url);

        update_function("Anexando imagem...")

        return image_url
    }
    catch (error) {
        console.log(JSON.stringify(error, null, 2));
        update_function("Erro ao gerar imagem.")
        return null
    }
}

