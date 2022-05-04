const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('mute someone')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select a user')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('minutes')
				.setDescription('For how long? (in minutes)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason')),

	async execute(client, interaction) {

		const user = interaction.options.getUser('user')
		const minutes = interaction.options.getInteger('minutes')
		const guildMember = client.guilds.cache.get(config.guildId).members.cache.get(user.id)

		if(guildMember.kickable) {

			if(interaction.options.getString('reason')){
				reason = interaction.options.getString('reason')
			} else {
				reason = "Neuveden"
			}

			const Embed = new MessageEmbed()
				.setColor(config.colors.embedInfoColor)
				.setTitle('Mute')
				.setDescription(`Uživatel ${user.username} byl ztlumen na ${minutes} minut/y/u, důvod: ${reason}`)
				.setTimestamp()

			guildMember.timeout(minutes * 60 * 1000, reason)
				.then(console.log(`Uživatel ${user.username} byl ztlumen na ${minutes} minut/y/u, důvod: ${reason}`))

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
			content: "Mute neproběhl úspěšně",
			ephemeral: true,
		});
	},
};
