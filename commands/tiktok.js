const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tiktok')
		.setDescription('Send our tiktok url'),
	async execute(interaction) {
		await interaction.reply({
			content: 'Náš TikTok: https://tiktok.com/@jaknaweby/ !',
			ephemeral: true,
		});
	},
};
