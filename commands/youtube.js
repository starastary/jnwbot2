const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Send our youtube url'),
	async execute(client, interaction) {
		await interaction.reply({
			content: 'Náš YT: https://www.youtube.com/jaknaweby/ !',
			ephemeral: true,
		});
	},
};
