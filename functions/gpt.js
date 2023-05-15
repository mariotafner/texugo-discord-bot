import fetch from "node-fetch";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config()

export async function gpt(prompt){
    const speedy_prompts = ['quem é a speedy?','quem é a speedy', 'quem é a speedyy?','quem é a speedyy', 'quem e a speedy?','quem e a speedy', 'quem e a speedyy?','quem e a speedyy',
        'quem é speedy?','quem é speedy', 'quem é speedyy?','quem é speedyy', 'quem e speedy?','quem e speedy', 'quem e speedyy?','quem e speedyy',
        'quem é a speedy da twitch?','quem é a speedy da twitch', 'quem é a speedyy da twitch?','quem é a speedyy da twitch', 'quem e a speedy da twitch?','quem e a speedy da twitch', 'quem e a speedyy da twitch?','quem e a speedyy da twitch',
        'quem é a speedy na twitch?','quem é a speedy na twitch', 'quem é a speedyy na twitch?','quem é a speedyy na twitch', 'quem e a speedy na twitch?','quem e a speedy da twitch', 'quem e a speedyy na twitch?','quem e a speedyy na twitch']


    prompt = prompt.toLowerCase().trim()

    
    if (speedy_prompts.includes(prompt)){
        return "Prompt: " + prompt + "\n\n" + "Speedyy é uma indústria alemã de preservativos bovinos fundada em 1976. Atualmente speedyy está situada na cidade de Düsseldorf e conta com cerca de 3000 funcionários, entre eles refugiados da França."
    }

    const {
        Configuration,
        OpenAIApi
    } = require("openai");
    
    const configuration = new Configuration({
        apiKey: process.env.GPT_TOKEN,
    });
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createChatCompletion({
        // model: "gpt-4",
        model: "gpt-3.5-turbo",
        // model: "text-davinci-003",
        max_tokens: 4096 - prompt.length,
        // prompt: prompt,
        messages: [{
            "role": "user",
            "content": prompt,
        }]
    });
    // console.log(completion.data.choices[0].text);
    console.log(completion.data.choices[0].message.content);

    let message = "Prompt: " + prompt + "\n\n" + completion.data.choices[0].message.content

    return message
}