import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export async function image_text(text) {
    let prom = new Promise(async (res, rej) => {
        let fonts = [
            'Pacifico',
            'Gochi Hand',
            'Delius',
            'Sue Ellen Francisco',
            'Finger Paint',
            'Poor Story',
            'New Tegomin',
            'IM Fell Great Primer SC',
            'Gowun Dodum',
            'Jacques Francois',
            'Lemon'
        ]

        let random_font = fonts[Math.floor(Math.random() * fonts.length)]

        let theme = Math.floor(Math.random() * 2)

        console.log(theme)

        const nodeHtmlToImage = require('node-html-to-image')

        let font_size = 50 - (text.length / 5)

        let buffer = await nodeHtmlToImage({
            //output: './image.png',
            puppeteerArgs: {
                //args: ['--no-sandbox', '--disable-setuid-sandbox']
                args: ['--no-sandbox']
            },
            html: `<html> 
                    <head>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Delius&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Sue+Ellen+Francisco&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Finger+Paint&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Poor+Story&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=IM+Fell+Great+Primer+SC&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Jacques+Francois&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Lemon&display=swap');
                            body {
                                font-family: ${random_font}, cursive;
                                width: 500px;
                                height: 500px;
                                font-size: ${font_size}pt;
                                background-image: url('https://picsum.photos/600');
                                background-size: cover;
                                background-repeat: no-repeat;
                                background-position: center;
                            }
                            div{
                                text-align: center;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                padding: 50px;
                                margin: 0;
                                width: calc(100% - 100px);
                                height: calc(100% - 100px);
                                background-color: ${ theme == 0 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
                                color: ${ theme == 0 ? 'white' : 'black'};
                            }
                        </style>
                    </head>
                    <body>
                        <div>
                            <span>${text}</span>
                        </div>
                    </body>
                </html>`
        })
        //interaction.reply('test')/*{ files: [buffer] }*/
        console.log(buffer)
        res(buffer)
    })
    return prom
} 