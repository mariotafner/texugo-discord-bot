import fetch from "node-fetch";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config()

export async function get_helix_token(){
    const api_url = 'https://id.twitch.tv/oauth2/token'

    var urlencoded = new URLSearchParams();
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

export async function user_info(username) {
    let user_l1 = await fetch('https://api.twitch.tv/helix/users?login=' + username, {
        method: 'GET',
        headers: {
            'Client-ID': process.env.HELIX_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.HELIX_TOKEN
        }
    })
    user_l1 = await user_l1.json()


    let user_l2 = await fetch('https://gql.twitch.tv/gql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'OAuth ' + process.env.TWITCH_OAUTH_TOKEN
        },
        body: JSON.stringify([
            {
                "operationName": "ViewerCardModLogsMessagesBySender",
                "variables": {
                    "senderID": user_l1.data[0].id,
                    "channelLogin": "speedyy"
                },
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

    console.log(user_l2)
}