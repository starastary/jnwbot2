const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('web')
		.setDescription('Send our web url'),
	async execute(interaction) {
		await interaction.reply({
			content: 'Náš web: https://jaknaweby.eu/ !',
			ephemeral: true,
		});
	},
};
