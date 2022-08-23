const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Send commands list'),
	async execute(client, interaction) {
		await interaction.reply({
			content: '**Nápověda**\n/help - ukáže tento seznam\n/web - pošle odkaz na náš web\n/ig - pošle odkaz na náš instagram\n/yt - pošle odkaz na náš youtube kanál\n/tiktok - pošle odkaz na náš tiktok\n/twitter - pošle odkaz na náš twitter\n/fun - memes, citáty...\n/ping - zkouška odezvy\n',
			ephemeral: true,
		});
	},
};
