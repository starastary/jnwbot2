const config = require('../config.json');

module.exports = {
	name: "guildMemberAdd",
	async execute(client, member) {
			const guild = member.guild;

			let countmem = +guild.memberCount - config.botCount;

			guild.channels.cache.get(config.channels.welcome).send(`${member.user} se připojil! Nyní máme ${countmem} členů! :heart:\nNastav si tvé oblíbené programovací jazyky a oznámení v <#${config.channels.languages}>!`)

			const membersNumChan = guild.channels.cache.get(config.channels.membersNum)
			const botsNumChan = guild.channels.cache.get(config.channels.botsNum)
			
			membersNumChan.setName(`🧑┋Members: ${countmem}`)
			botsNumChan.setName(`🤖┋Bots: ${config.botCount}`)
	}
}