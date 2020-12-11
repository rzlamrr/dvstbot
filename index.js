const { create, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const options = require('./dvstbot/utils/options')
const { color, messageLog } = require('./dvstbot/utils')
const handler = require('./dvstbot/handler')

const start = (dvstbot = new Client()) => {
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('dvstbot BOT', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color('[DEV]'), color('dvstbot', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))

    // Mempertahankan sesi agar tetap nyala
    dvstbot.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') dvstbot.forceRefocus()
    })

    // ketika bot diinvite ke dalam group
    dvstbot.onAddedToGroup(async (chat) => {
	const groups = await dvstbot.getAllGroups()
	// kondisi ketika batas group bot telah tercapai,ubah di file settings/setting.json
	if (groups.length > groupLimit) {
	await dvstbot.sendText(chat.id, `Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`).then(() => {
	      dvstbot.leaveGroup(chat.id)
	      dvstbot.deleteChat(chat.id)
	  })
	} else {
	// kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
	    if (chat.groupMetadata.participants.length < memberLimit) {
	    await dvstbot.sendText(chat.id, `Sorry, BOT comes out if the group members do not exceed ${memberLimit} people`).then(() => {
	      dvstbot.leaveGroup(chat.id)
	      dvstbot.deleteChat(chat.id)
	    })
	    } else {
        await dvstbot.simulateTyping(chat.id, true).then(async () => {
          await dvstbot.sendText(chat.id, `Hi, Im dvstbot. To find out the commands on this bot type ${prefix}menu`)
        })
	    }
	}
    })

    // ketika seseorang masuk/keluar dari group
    dvstbot.onGlobalParicipantsChanged(async (event) => {
        const host = await dvstbot.getHostNumber() + '@c.us'
		const welcome = JSON.parse(fs.readFileSync('./dvstbot/settings/welcome.json'))
		const isWelcome = welcome.includes(event.chat)
		let profile = await dvstbot.getProfilePicFromServer(event.who)
		if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
        // kondisi ketika seseorang diinvite/join group lewat link
        if (event.action === 'add' && event.who !== host && isWelcome) {
			await dvstbot.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
            await dvstbot.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
        }
        // kondisi ketika seseorang dikick/keluar dari group
        if (event.action === 'remove' && event.who !== host) {
			await dvstbot.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
            await dvstbot.sendTextWithMentions(event.chat, `Good bye @${event.who.replace('@c.us', '')}, We'll miss you✨`)
        }
    })

    dvstbot.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await dvstbot.sendText(callData.peerJid, 'Maaf sedang tidak bisa menerima panggilan.\n\n-dvstbot')
        .then(async () => {
            // bot akan memblock nomor itu
            await dvstbot.contactBlock(callData.peerJid)
        })
    })

    // ketika seseorang mengirim pesan
    dvstbot.onMessage(async (message) => {
        dvstbot.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[dvstbot]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    dvstbot.cutMsgCache()
                }
            })
        handler(dvstbot, message)

    })

    // Message log for analytic
    dvstbot.onAnyMessage((anal) => {
        messageLog(anal.fromMe, anal.type)
    })
}

//create session
create(options(true, start))
    .then((dvstbot) => start(dvstbot))
    .catch((err) => new Error(err))
