import fetch from "node-fetch";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config()

export async function get_helix_token(){
    const api_url = 'https://id.twitch.tv/oauth2/token'

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.HELIX_CLIENT_ID);	
    urlencoded.append("client_secret", process.env.HELIX_CLIENT_SECRET);
    urlencoded.append("grant_type", "client_credentials");

    const ret = await fetch(api_url, {
        method: 'POST',
        body: urlencoded
    })
    const result = await ret.json()
    return result
}

export async function user_info(username, callback) {
    const helix_token = await get_helix_token()
    console.log(helix_token)
    let user_l1 = await fetch('https://api.twitch.tv/helix/users?login=' + username, {
        method: 'GET',
        headers: {
            'Client-ID': process.env.HELIX_CLIENT_ID,
            'Authorization': 'Bearer ' + helix_token.access_token
        }
    })
    user_l1 = await user_l1.json()
    console.log(user_l1)

    let user_l2 = {}
    let cursor = null
    let qtd = 0
    let first_message = null
    let color = "#FFFFFF"
    do {
        let variables = {
            "senderID": user_l1.data[0].id,
            "channelLogin": "speedyy"
        }

        if (cursor) {
            variables["cursor"] = cursor
        }

        user_l2 = await fetch('https://gql.twitch.tv/gql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'OAuth ' + process.env.GQL_TOKEN
            },
            body: JSON.stringify([
                {
                    "operationName": "ViewerCardModLogsMessagesBySender",
                    "variables": variables,
                    "extensions": {
                        "persistedQuery": {
                            "version": 1,
                            "sha256Hash": "437f209626e6536555a08930f910274528a8dea7e6ccfbef0ce76d6721c5d0e7"
                        }
                    }
                }
            ])
        })
        user_l2 = await user_l2.json()

        console.log(user_l2[0].data.channel.modLogs.messagesBySender.edges)

        for (let msg of user_l2[0].data.channel.modLogs.messagesBySender.edges) {
            try{
                console.log(msg.node)
                cursor = msg.cursor
                qtd++
                if (msg.node.sender.chatColor)
                    color = msg.node.sender.chatColor
                if (msg.node.sentAt)
                    first_message = msg.node.sentAt // first message sent by the user
            }
            catch{
                console.log(msg)
            }
        }
        callback({
            username: username,
            profile: user_l1.data[0].profile_image_url,
            qtd: qtd,
            color: color,
            first_message: first_message,
            loading: true
        })
    
    } while (user_l2[0].data.channel.modLogs.messagesBySender.edges.length != 0)
    callback({
        loading: false
    })
}