const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Send commands list'),
	async execute(client, interaction) {
		await interaction.reply({
			content: ':flag_cz: **Nápověda**\n/help - ukáže tento seznam\n/web - pošle odkaz na náš web\n/ig - pošle odkaz na náš instagram\n/yt - pošle odkaz na náš youtube kanál\n/tiktok - pošle odkaz na náš tiktok\n/twitter - pošle odkaz na náš twitter\n/ping - zkouška odezvy\n\n:flag_gb: **Help**\n/help - Shows this list\n/web - sends link to our website\n/ig - sends link to our instagram\n/yt - sends link to our youtube channel\n/tiktok - sends link to our tiktok\n/twitter -sends link to our twitter\n/ping - tests response time',
			ephemeral: true,
		});
	},
};
