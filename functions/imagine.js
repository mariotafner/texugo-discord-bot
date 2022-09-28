import fetch from "node-fetch";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config() //initialize dotenv

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export async function imagine(text) {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + process.env.DALLE_TOKEN
        },
        body: JSON.stringify({
            "task_type": "text2im",
            "prompt": {
                "caption": text,
                "batch_size": 4
            }
        })
    };

    let task = await fetch('https://labs.openai.com/api/labs/tasks', requestOptions)
    task = await task.json()
    console.log(task)
    let task_id = task.id

    requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + process.env.DALLE_TOKEN
        }
    };

    let status = 'pending'
    while (status == 'pending') {
        await wait(1000)
        let task_status = await fetch('https://labs.openai.com/api/labs/tasks/' + task_id, requestOptions)
        task_status = await task_status.json()
        status = task_status.status

        if (status == 'succeeded') {
            console.log(task_status.generations.data)
            return task_status.generations.data
        }
    }
}