const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban someone')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select a user')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('delete_messages')
				.setDescription('Delete messages from last 7 days?'))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason')),

	async execute(client, interaction) {

		const user = interaction.options.getUser('user')
		const delmessages = interaction.options.getBoolean('delete_messages')
		const guildMember = client.guilds.cache.get(config.guildId).members.cache.get(user.id)

		console.log(guildMember.bannable)
		if(guildMember.bannable) {
			let days = 0
			if(delmessages){
				days = 7
			}

			if(interaction.options.getString('reason')){
				reason = interaction.options.getString('reason')
			} else {
				reason = "Neuveden"
			}

			const Embed = new MessageEmbed()
				.setColor(config.colors.embedInfoColor)
				.setTitle('Ban')
				.setDescription(`Uživatel ${user.username} byl zabanován, důvod: ${reason}`)
				.setTimestamp()

			guildMember.ban({
				days: days,
				reason: reason
			})
			.then(console.log(`Uživatel ${user.username} byl zabanován, důvod: ${reason}`))
			


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
			content: "Ban neproběhl úspěšně",
			ephemeral: true,
		});
	},
};
