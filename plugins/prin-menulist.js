import fs, { promises as fsp } from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import { Jimp } from 'jimp'
import { xpRange } from '../lib/levelling.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const prem = (global.prems || []).includes(m.sender.split`@`[0])

    const Styles = (text, style = 1) => {
      const xStr = 'abcdefghijklmnñopqrstuvwxyz1234567890'.split('')
      const yStr = Object.freeze({
        1: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴñᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ1234567890'
      })
      const map = xStr.map((v, i) => ({ o: v, c: yStr[style].split('')[i] || v }))
      return text.toLowerCase().split('').map(v => (map.find(x => x.o === v)?.c || v)).join('')
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms))

    async function resizeImage(buffer, width, height) {
      try {
        const img = await Jimp.read(buffer)
        return await img.resize({ width, height }).getBufferAsync(Jimp.MIME_JPEG)
      } catch {
        return buffer
      }
    }

    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)

    function clockString(ms) {
      let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
      let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
      let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
      return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
    }

    function limaGreetingText() {
      const now = new Date()
      const hour = new Intl.DateTimeFormat('es-PE', { hour: 'numeric', hour12: false, timeZone: 'America/Lima' }).format(now)
      const h = parseInt(hour, 10)
      if (h >= 5 && h < 12) return 'Buenos días 🏙'
      if (h >= 12 && h < 18) return 'Buenas tardes 🌤'
      return 'Buenas noches 🌙'
    }



    const _package = JSON.parse((await fsp.readFile(join(__dirname, '../package.json')).catch(() => '{}')).toString())
    const userData = (global.db?.data?.users?.[m.sender]) || {}
    const exp = userData.exp || 0
    const level = userData.level || 0
    const role = userData.role || 'Newbie'
    const limit = userData.limit || 20
    const money = userData.money || 10000
    const { min, xp, max } = xpRange(level, global.multiplier || 1)
    const name = (await conn.getName(m.sender)) || 'User'
    const meName = await conn.getName(conn.user?.id || conn.user?.jid || '')
    const totalreg = Object.keys(global.db?.data?.users || {}).length
    const rtotalreg = Object.values(global.db?.data?.users || {}).filter(u => u.registered).length
    const totalFitur = Object.keys(global.plugins || {}).length

    const d = new Date()
    const locale = 'es-PE'
    const week = d.toLocaleDateString(locale, { weekday: 'long', timeZone: 'America/Lima' })
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Lima' })
    const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Lima' })

    const _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = (await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      })) * 1000
    }
    const muptime = clockString(_muptime)
    const uptime = clockString(_uptime)

    const imgPath1 = join(__dirname, '../imgs.jpg')
    const thumbLocal = fs.existsSync(imgPath1) ? fs.readFileSync(imgPath1) : null
    const thumbResized = thumbLocal ? await resizeImage(thumbLocal, 300, 150) : null

    const headerGreet = `${limaGreetingText()}`
    const tagUser = '@' + m.sender.split('@')[0]

    const menu = `hello *${tagUser}!* ${headerGreet}
bienvenido uwu *${meName || 'MyBot'}*, soy BocchiTheRock-MD estoy aquí para ayudarte 🌌

╭──┈➤ *\`𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥\`*
│ 𔓕 *Nombre*  : ${name}
│ 𔓕 *Tag*     : ${tagUser}
│ 𔓕 *Rol*     : ${role}
│ 𔓕 *Nivel*   : ${level} (${(exp - (min || 0))}/${xp || 100})
│ 𔓕 *Límite*  : ${limit}
│ 𔓕 *Money*   : S/.${money.toLocaleString('es-PE')}
│ 𔓕 *Premium* : ${prem ? '✅' : '❌'}
╰────────────────┈➤

╭──┈➤ *\`𝗜𝗡𝗙𝗢 𝗕𝗢𝗧\`*
│ 𔓕 *Nombre*     : ${meName || 'Bot'}
│ 𔓕 *Owner*      : ${_package?.author?.name || 'dev'}
│ 𔓕 *Powered*    : WhatsApp Business
│ 𔓕 *Prefix*     : ${_p}
│ 𔓕 *Mode*       : ${global.opts?.['self'] ? 'Privado' : 'Público'}
│ 𔓕 *Total Fitur*: ${totalFitur}+
│ 𔓕 *Version*    : ${_package?.version || '1.0.0'}
│ 𔓕 *Language*   : Javascript
│ 𔓕 *Type*       : NodeJs/Case
│ 𔓕 *Library*    : Baileys-MD
│ 𔓕 *Uptime*     : ${uptime}
│ 𔓕 *Users*      : ${totalreg} (${rtotalreg} reg.)
│ 𔓕 *Hora*       : ${time} WIB
│ 𔓕 *Día*        : ${week}
│ 𔓕 *Fecha*      : ${date}
╰────────────────┈➤`.trim()

    const nativeFlowPayload = {
      header: { hasMediaAttachment: true },
      body: { text: '' },
      footer: { text: menu },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({ title: 'Seleccionar menú', sections: [{ title: 'BocchiTheRock-MD', rows: [{ title: 'Menú completo', description: 'Ver todos los comandos', id: `${_p}allmenu` }] }] })
        }, {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({ display_text: 'Copiar código', copy_code: `${_p}menu` })
        }]
      },
      contextInfo: { mentionedJid: [m.sender], forwardingScore: 1, isForwarded: false }
    }

    await conn.relayMessage(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: m.quoted ? {
                senderKeyHash: m.quoted.senderKeyHash || null,
                recipientKeyHash: m.quoted.recipientKeyHash || null
              } : null,
              deviceListMetadataVersion: m.quoted ? 2 : 1
            },
            interactiveMessage: nativeFlowPayload
          }
        }
      },
      { quoted: m }
    )
    } catch (e) {
    console.error(e)
    await m.react?.('❎')
    await m.reply(`❌ Error: ${e?.message || e}`)
  }
}

handler.help = ['menulist']
handler.tags = ['main']
handler.command = ['mls','menulist']
handler.register = true

export default handler
