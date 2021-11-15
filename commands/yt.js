const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yt')
		.setDescription('Send our youtube url'),
	async execute(interaction) {
		await interaction.reply('Náš YT: https://www.youtube.com/jaknaweby');
	},
};
