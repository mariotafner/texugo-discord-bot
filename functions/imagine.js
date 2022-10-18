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
    let login = await fetch('https://labs.openai.com/api/labs/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + process.env.DALLE_TOKEN
        },
    })
    login = await login.json()
    console.log(login)

    update_function('Criando task...')
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + login.user.session.sensitive_id
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
            'authorization': 'Bearer ' + login.user.session.sensitive_id
        }
    };

    update_function('Aguardando task')
    let status = 'pending'
    let dots = ''
    while (status == 'pending') {
        await wait(1000)
        dots += '.'
        update_function('Aguardando task' + dots)
        let task_status = await fetch('https://labs.openai.com/api/labs/tasks/' + task_id, requestOptions)
        task_status = await task_status.json()
        status = task_status.status

        if (status == 'succeeded') {
            console.log(task_status.generations.data)
            update_function('Task concluída')
            return task_status.generations.data
        }
    }
}