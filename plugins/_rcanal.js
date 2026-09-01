import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

export async function before(m, { conn }) {
  try {
    let nombreBot = global.botname || 'Bot'
    let bannerFinal = 'https://raw.githubusercontent.com/Andresv27728/dtbs/main/Bocchi.jpg'

    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = path.join('./Sessions/SubBot', botActual, 'config.json')

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath))
        if (config.name) nombreBot = config.name
        if (config.banner) bannerFinal = config.banner
      } catch (err) {
        console.log('⚠️ No se pudo leer config del subbot en rcanal:', err)
      }
    }

    const canales = [global.idcanal || '120363403739366547@newsletter', global.idcanal2 || '120363403739366547@newsletter']
    const channelRD = global.channelRD || { id: canales[0], name: 'BocchiTheRock-MD' }

    let bannerBuffer = null
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      bannerBuffer = await (await fetch(bannerFinal, { signal: controller.signal })).buffer()
      clearTimeout(timer)
    } catch {
      bannerBuffer = null
    }

    global.rcanal = {
      contextInfo: {
        isForwarded: true,
        forwardingScore: 1,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name,
        },
        externalAdReply: {
          title: nombreBot,
          body: '🌌 BocchiTheRock-MD',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: false,
          thumbnail: bannerBuffer,
          jpegThumbnail: bannerBuffer,
          sourceUrl: ''
        },
        matchedText: ""
      }
    }

  } catch (e) {
    console.log('Error al generar rcanal:', e)
  }
}
