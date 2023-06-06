import { createRequire } from 'module'
const require = createRequire(import.meta.url)

//import editly from 'editly';
var ffmpeg = require('fluent-ffmpeg');
const fs = require('fs')


export async function video_caption(video_url, text) {
    let prom = new Promise(async (res, rej) => {
        async function run(cmd){
            const util = require('util');
            const exec = util.promisify(require('child_process').exec);

            const { stdout, stderr } = await exec(cmd);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            return stdout
        }

        async function download(url) {
            const http = require('http'); // or 'https' for https:// URLs
            const https = require('https');
            const fs = require('fs');

            console.log(video_url)
            let ext = video_url.split('.').pop()  

            await new Promise(async (res, rej) => {
                const file = fs.createWriteStream("video/video." + ext);
                const request = https.get(video_url, function(response) {
                    response.pipe(file);

                    // after download completed close filestream
                    file.on("finish", () => {
                        file.close();
                        console.log("Download Completed");
                    });
                    res()
                });
            })
        }

        //run('editly --help')

        await download(video_url)
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        let ext = video_url.split('.').pop()  
        
        const input_video = 'video/video.' + ext;
        ffmpeg.ffprobe(input_video, async function(err, metadata) {       
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
                                    width: ${metadata.streams[0].width}px;
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
                            </style>
                        </head>
                        <body>
                            <div class="caption">${text}</div>
                        </body>
                    </html>`
            })
        
            //save image
            await fs.writeFileSync('video/image.png', buffer)
        
            const sizeOf = require('image-size')
            const dimensions = sizeOf('video/image.png')
            console.log(dimensions.width, dimensions.height)
            
            let caption_height = dimensions.height / (metadata.streams[0].height + dimensions.height)
            let video_height = metadata.streams[0].height / (metadata.streams[0].height + dimensions.height)

            let mod_2 = (metadata.streams[0].height + dimensions.height) % 2

            const editSpec = {
                outPath: 'video/out.mp4',
                width: metadata.streams[0].width,
                height: mod_2 == 0 ? metadata.streams[0].height + dimensions.height : metadata.streams[0].height + dimensions.height + 1,
                clips: [{
                    layers: [
                        {
                            type: 'fill-color',
                            color: '#000000',
                        },
                        {
                            type: 'video',
                            path: input_video,
                            top: caption_height,
                            width: 1,
                            height: video_height,
                            resizeMode: 'stretch',
                        },
                        {
                            type: 'image-overlay',
                            path: 'video/image.png',
                            top: 0,
                            width: 1,
                            height: caption_height,
                            resizeMode: 'stretch',
                            position: 'top',
                        },
                    ],
                }],
            
                keepSourceAudio: true,
                verbose: true,
                enableFfmpegLog: true,
                //fast: true,
            }

            //save edit spec
            await fs.writeFileSync('video/editSpec.json', JSON.stringify(editSpec))

            
            //await editly(editSpec)

            /*let video_buffer = fs.readFileSync('out.mp4')

            console.log(video_buffer)
            res(video_buffer)*/

            res('video/out.mp4')
        });
    })
    return prom
} 

/*
"fluent-ffmpeg": "^2.1.2",
"editly": "^0.14.2",
*/