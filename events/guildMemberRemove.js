const config = require('../config.json');

module.exports = {
	name: "guildMemberRemove",
	async execute(client, member) {
			const guild = client.guilds.cache.get(config.guildId);
			let countmem = +guild.memberCount - config.botCount;

			guild.channels.cache.get(config.channels.welcome).send(`@${member.user.username} nás opustil. Nyní máme pouze ${countmem} členů :pleading_face:`)

			const membersNumChan = guild.channels.cache.get(config.channels.membersNum)
			const botsNumChan = guild.channels.cache.get(config.channels.botsNum)
			
			membersNumChan.setName(`🧑┋Members: ${countmem}`)
			botsNumChan.setName(`🤖┋Bots: ${config.botCount}`)
	}
}