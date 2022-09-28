export async function startLoadingMessage(msg) {
    let attachments = Array.from(msg.attachments)
    if (attachments.length > 0) {
        msg.edit({
            content: '',
        })
        return
    }
        

    if (msg.content.startsWith('Carregando')) {
        if (msg.content == 'Carregando') {
            await msg.edit('Carregando.')
        }
        else if (msg.content == 'Carregando.') {
            await msg.edit('Carregando..')
        }
        else if (msg.content == 'Carregando..') {
            await msg.edit('Carregando...')
        }
        else if (msg.content == 'Carregando...') {
            await msg.edit('Carregando')
        }

        setTimeout(() => {
            startLoadingMessage(msg)
        }, 500);
    }
}

