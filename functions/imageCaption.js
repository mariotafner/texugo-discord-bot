import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export async function image_caption(image, text) {
    let prom = new Promise(async (res, rej) => {
        const nodeHtmlToImage = require('node-html-to-image')
        let buffer = await nodeHtmlToImage({
            //output: './image.png',
            puppeteerArgs: {
                //args: ['--no-sandbox', '--disable-setuid-sandbox']
                args: ['--no-sandbox']
            },
            html: `<html> 
                    <head>
                        <style>
                            body{
                                padding: 0;
                                margin: 0;
                                width: fit-content;
                                height: fit-content;
                                background-color: black;
                            }
                            .caption{
                                font-family: Arial Black, Arial Bold, Gadget, sans-serif;
                                font-size: 7vh;
                                color: white;
                                background-color: black;
                                width: 100%;
                                padding: 2vw;
                            }
                            img{
                                min-width: 100vw;
                                margin-bottom: 2vh;
                                margin-left: 2vh;
                                margin-right: 2vh;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="caption">${text}</div>
                        <img src="${image}"/>
                    </body>
                </html>`
        })
        
        console.log(buffer)
        res(buffer)
    })
    return prom
} 