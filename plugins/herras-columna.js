let handler = async (m, { conn }) => {
  let header = '┏━━「 *TABLA* 」━━┓\n'
  let body = '┃ owner 1 : yosue\n┃ owner 2 : ado\n'
  let footer = '┗━━━━━━━━━━━━┛\n> canal: '
  await conn.reply(m.chat, header + body + footer, m)
}

handler.command = ['tabla']

export default handler
