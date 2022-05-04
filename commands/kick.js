const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kick someone')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select a user')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason')),

	async execute(client, interaction) {

		const user = interaction.options.getUser('user')
		const guildMember = client.guilds.cache.get(config.guildId).members.cache.get(user.id)

		if(guildMember.kickable) {

			if(interaction.options.getString('reason')){
				reason = interaction.options.getString('reason')
			} else {
				reason = "Neuveden"
			}

			const Embed = new MessageEmbed()
				.setColor(config.colors.embedInfoColor)
				.setTitle('Kick')
				.setDescription(`Uživatel ${user.username} byl vyhozen, důvod: ${reason}`)
				.setTimestamp()

			guildMember.kick(reason)
			.then(console.log(`Uživatel ${user.username} byl vyhozen, důvod: ${reason}`))

			await interaction.reply({
				embeds: [Embed]
			})

			const guild = client.guilds.cache.get(`${config.guildId}`);

			guild.channels.cache.get(`${config.channels.adminLog}`).send({
				embeds: [Embed]
			})
			return
		}

		await interaction.reply({
			content: "Kick neproběhl úspěšně",
			ephemeral: true,
		});
	},
};
