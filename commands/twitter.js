const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitter')
		.setDescription('Send our twitter url'),
	async execute(interaction) {
		await interaction.reply({
			content: 'Náš Twitter: https://twitter.com/jaknaweby/ !',
			ephemeral: true,
		});
	},
};
