import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export async function stream_summary() {
    let prom = new Promise(async (res, rej) => {
        const nodeHtmlToImage = require('node-html-to-image')
        let buffer = await nodeHtmlToImage({
            //output: './image.png',
            puppeteerArgs: {
                //args: ['--no-sandbox', '--disable-setuid-sandbox']
                args: ['--no-sandbox']
            },
            html: ` <html> 
                        <head>
                            <style>
                                body {
                                    padding: 0;
                                    margin: 0;
                                    width: fit-content;
                                    height: fit-content;
                                }
                                iframe {
                                    width: 100vw;
                                    height: 2000px;
                                }
                            </style>
                        </head>
                        <body>
                            <iframe src="http://localhost:3000/stream_summary" frameborder="0"></iframe>
                        </body>
                    </html>`
        })
        
        console.log(buffer)
        res(buffer)
    })
    return prom
} 