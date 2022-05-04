const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('message')
		.setDescription('message')
		.setDefaultPermission(false)
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('Select a channel (ID)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message')
				.setRequired(true)),

	async execute(client, interaction) {
		const guild = client.guilds.cache.get(config.guildId);

		const channel = interaction.options.getString('channel')
		const message = interaction.options.getString('message')
		
		guild.channels.cache.get(channel).send(message)

		await interaction.reply({
			content: "Zpráva poslána úspěšně",
			ephemeral: true,
		});
	},
};
