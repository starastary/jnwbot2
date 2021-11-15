const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ig')
		.setDescription('Send our instagram url'),
	async execute(interaction) {
		await interaction.reply('Náš IG: https://www.instagram.com/jaknaweby');
	},
};
