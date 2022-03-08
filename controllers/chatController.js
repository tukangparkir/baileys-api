import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'
import response from './../response.js'

const getList = (req, res) => {
    return response(res, 200, true, '', getChatList(res.locals.sessionId))
}

const send = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const { message } = req.body

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        await sendMessage(session, receiver, { text: message })

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}

const sendBulk = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const errors = []

    for (const [key, data] of req.body.entries()) {
        if (!data.receiver || !data.message) {
            errors.push(key)

            continue
        }

        data.receiver = formatPhone(data.receiver)

        try {
            const exists = await isExists(session, data.receiver)

            if (!exists) {
                errors.push(key)

                continue
            }

            await sendMessage(session, data.receiver, { text: data.message })
        } catch {
            errors.push(key)
        }
    }

    if (errors.length === 0) {
        return response(res, 200, true, 'All messages has been successfully sent.')
    }

    const isAllFailed = errors.length === req.body.length

    response(
        res,
        isAllFailed ? 500 : 200,
        !isAllFailed,
        isAllFailed ? 'Failed to send all messages.' : 'Some messages has been successfully sent.',
        { errors }
    )
}
///
const button = async (req, res) => {   
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)    
    const {message} = req.body
    const {footer} = req.body

    const {buttonid} = req.body
    const buttonidz = buttonid.split(",");
    const {button} = req.body
    const buttonz = button.split(",");
    
  
    const buttons = []
    for(var num in buttonidz)
    {console.log(buttons.push(
        {buttonId: buttonidz[num], buttonText: {displayText: buttonz[num]}, type: 1}
        ))}       
  
    try {
        const exists = await isExists(session, receiver)
        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }
        await sendMessage(session, receiver, { text: message, footer: footer, buttons: buttons})
        
        
        console.log (sendMessage);      

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}

const buttontemplate = async (req, res) => {   
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const {footer} = req.body
    const {message} = req.body
    const button1 = req.body.button1
    const button2 = req.body.button2
    const button3 = req.body.button3

    const urlbutton = req.body.urlbutton
    const urls = req.body.urls
    
    
    


    const templateButtons = [
        {index: 1, urlButton: {displayText: ', url: 'https://github.com/adiwajshing/Baileys'}},
        {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
        {index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}}
    ]
       
    
    try {
        const exists = await isExists(session, receiver)
        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }
        await sendMessage(session, receiver, {text: message, footer: footer, templateButtons: templateButtons})
        
        
        console.log (sendMessage);      

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}


const list = async (req, res) => {
    
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver) 


    const {message} = req.body
    const {footer} = req.body
    const {title} = req.body
    const {titlemenu} = req.body
    const {buttontext} = req.body
    
    
    const {idbuttonz} = req.body
    const idbutton = idbuttonz.split(",") 
    const tombolist = req.body.button
    const listtombol = tombolist.split(",")

    
    
    
    const listMessage = []
    for(var num in listtombol)
    {console.log
        (listMessage.push
            ({title: "menu",rows: [{title: listtombol[num], rowId: listtombol[num]}]}))
    }
    
   // send a list message!

const rows =[]

for (var num in listtombol){
   (rows.push({title: listtombol[num], rowId: idbutton[num]}))}

   const sections = [{title: titlemenu, rows: rows}]

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        await sendMessage(session, receiver, { text: message, footer: footer, title: title, buttonText: buttontext, sections})
        console.log (sendMessage);

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}

const contact = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const nama = req.body.nama
    const nomor = req.body.nomor
    const telp = req.body.telp
    const lembaga = req.body.lembaga

    const vcard = `BEGIN:VCARD\n` // metadata of the contact card
    +`VERSION:3.0\n`
    +`FN:${nama}.\n` // full name
    +`ORG:${lembaga};\n` // the organization of the contact
    +`TEL;type=CELL;type=VOICE;waid=${nomor}:${telp}\n` // WhatsApp ID + phone number
    +`END:VCARD`

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        await sendMessage(session, receiver, { 
            contacts: { 
                displayName: nama, 
                contacts: [{ vcard }] 
            }
        })

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}

const location = async (req, res) => {
       
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const latitude  = req.body.latitude
    const longitude  = req.body.longitude

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        await sendMessage(session, receiver, { location: { degreesLatitude: latitude, degreesLongitude: longitude } })

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}


export { getList, send, sendBulk, button, location, contact, list, buttontemplate }
