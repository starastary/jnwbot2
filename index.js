const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const { token, guildId } = require('./config.json');
const config = require('./config.json');

const res = require('express/lib/response');
var mysql = require('mysql');
const axios = require('axios');
const cheerio = require('cheerio');
var encoder = new TextEncoder;
const betterConsole = require("./betterConsole");

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		// Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		//Intents.FLAGS.GUILD_INTEGRATIONS,
		//Intents.FLAGS.GUILD_WEBHOOKS,
		//Intents.FLAGS.GUILD_INVITES,
		// Intents.FLAGS.GUILD_VOICE_STATES,
		//Intents.FLAGS.GUILD_PRESENCES,
		//Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		//Intents.FLAGS.GUILD_MESSAGE_TYPING,
		// Intents.FLAGS.DIRECT_MESSAGES,
		// Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		//Intents.FLAGS.DIRECT_MESSAGE_TYPING
	]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

/* const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
} */

client.on("guildMemberAdd", function(member){

	log("Discord", `${member.user.username} has join the server`)
	const guild = member.guild;

	let countmem = +guild.memberCount - config.botCount;

	guild.channels.cache.get(config.channels.welcome).send(`${member.user} se připojil! Nyní máme ${countmem} členů! :heart:\nNastav si tvé oblíbené programovací jazyky a oznámení v <#${config.channels.languages}>!`)

	const membersNumChan = guild.channels.cache.get(config.channels.membersNum)
	const botsNumChan = guild.channels.cache.get(config.channels.botsNum)
	
	membersNumChan.setName(`🧑┋Members: ${countmem}`)
	botsNumChan.setName(`🤖┋Bots: ${config.botCount}`)
});

client.on("guildMemberRemove", function(member){

	log("Discord", `${member.user.username} has left the server`)
	const guild = client.guilds.cache.get(config.guildId);
	let countmem = +guild.memberCount - config.botCount;

	guild.channels.cache.get(config.channels.welcome).send(`@${member.user.username} nás opustil. Nyní máme pouze ${countmem} členů :pleading_face:`)

	const membersNumChan = guild.channels.cache.get(config.channels.membersNum)
	const botsNumChan = guild.channels.cache.get(config.channels.botsNum)
	
	membersNumChan.setName(`🧑┋Members: ${countmem}`)
	botsNumChan.setName(`🤖┋Bots: ${config.botCount}`)
});


let started = false

client.once('ready', () => {
	log("Discord", `Bot is online!`)
	started = true
	setInterval(updateChannelNames, (5 * 60 * 1000))
	setInterval(updateSocials, (20 * 60 * 1000))
	setInterval(checkBump, (5 * 60 * 1000))
	setInterval(heartbeat, (20 * 1000))
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		log("Discord", `${interaction.user.tag} triggered a command "${command.data.name}" in #${interaction.channel.name}`)
		await command.execute(client, interaction);
	} catch (e) {
		log("Discord Error", `Command ${command.data.name} in #${interaction.channel.name} FAILED, error:\n${e}`)
		await interaction.reply({ content: 'Něco se rozbilo :/!', ephemeral: true });
	}
});

client.login(token);

/*const express = require('express');
const { start } = require('repl');
const app = express()
const port = 3000

app.get('/', async (req, res) => {
	res.json(client.commands)
})

app.listen(port, () => {
	log("Web", `App listening at http://localhost:${port}`)
})*/

const updateChannelNames = () => {
	const guild = client.guilds.cache.get(config.guildId);
	let countmem = +guild.memberCount - config.botCount;

	const membersNumChan = guild.channels.cache.get(config.channels.membersNum)
	const botsNumChan = guild.channels.cache.get(config.channels.botsNum)

	membersNumChan.setName(`🧑┋Members: ${countmem}`)
	botsNumChan.setName(`🤖┋Bots: ${config.botCount}`)

}

var con = mysql.createConnection({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	charset: "utf8mb4"
});

con.connect(function (err) {
	if (err) throw err;
	log("DB", `Connected`)

});

const updateSocials = async () => {
	log("Socials", `Updating socials`)
	const guild = client.guilds.cache.get(config.guildId);
	try {
		const videos = await getYoutube();
		const savedVideos = await getSavedVideos();
		const newVideos = videos.filter(i => !savedVideos.includes(i.yt_id))

		await newVideos.forEach(async (video) => {
			await ins_yt(video.yt_id, video.title, video.description, video.thumbnail, video.link, video.link, video.timestamp)
			guild.channels.cache.get(config.channels.newVideos).send(`⁣<@&${config.rolesId.newVideos}>⁣\n\nNa našem youtube právě vyšlo nové video!\n\n${video.link}`)
		})
	} catch (e) {
		log("Error", `Updating videos failed, error: \n${e}`)
	}

	try {
		const posts = await getInstagram();
		const savedPosts = await getSavedPosts();
		const newPosts = posts.filter(i => !savedPosts.includes(i.ig_id))

		await newPosts.forEach(async (post) => {
			await ins_ig(post.ig_id, post.description, post.thumbnail, post.link, post.link, post.timestamp)
			guild.channels.cache.get(config.channels.newPosts).send(`⁣<@&${config.rolesId.newPosts}>⁣\n\nNa IG profilu @jaknaweby vyšel nový příspěvek! Jděte se mrknout!\n\n${post.link}`)
		})
	} catch (e) {
		log("Error", `Updating posts failed, error: \n${e}`)
	}
}

//decodeURIComponent(escape(""));

const getYoutube = async () => {
	const result = await axios.get('https://www.googleapis.com/youtube/v3/search', {
		params: {
			part: 'snippet',
			channelId: 'UCRnUvC_WduDyrjxDw9F51AQ',
			maxResults: 10,
			order: 'date',
			type: 'video',
			key: config.apiKeys.yt
		}
	})

	let data = [];

	result.data.items.forEach(element => {
		if (element.id.kind === "youtube#video") {
			let item = {
				yt_id: `${element.id.videoId}`,
				title: `${element.snippet.title}`,
				description: `${element.snippet.description}`,
				thumbnail: `${element.snippet.thumbnails.high.url}`,
				link: `https://www.youtube.com/watch?v=${element.id.videoId}`,
				timestamp: `${element.snippet.publishedAt}`
			}

			data.push(item)
		}

	});

	return data
}

const getInstagram = async () => {
	let data = [];

	var result = await axios.get(`https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${config.apiKeys.ig}&limit=10`, {
		headers: {},
		params: {}
	})

	result.data.data.forEach(element => {
		let item = {
			ig_id: `${element.id}`,
			thumbnail: `${element.media_url}`,
			description: `${element.caption}`,
			thumbnail: `${element.media_url}`,
			link: `${element.permalink}`,
			timestamp: `${element.timestamp}`
		}
		data.push(item)
	});

	return data
}



const query = async (sql) => {
	return new Promise((resolve, reject) => {
		con.query("USE c6jaknaweby", function (err, result) {
			if (err) reject(err);
		});

		//betterConsole.log('MySQL query', sql, "cyan");

		con.query(sql, (err, result) => {
			if (err) reject(err);
			resolve(result)
		});

	})
}

const ins_ig = (ig_id, description, thumbnail, link, ig_link, timestamp) => {
	sql = `INSERT INTO instagram_posts (ig_id, description, thumbnail, link, ig_link, timestamp, created_at, updated_at) VALUES (${con.escape(ig_id)}, ${con.escape(unescape(encodeURIComponent(description)))}, ${con.escape(thumbnail)}, ${con.escape(link)}, ${con.escape(ig_link)}, ${con.escape(timestamp)}, current_timestamp(), current_timestamp());`
	result = query(sql)
	log("DB", `Saved new post (${ig_id})`)
	return sql
}

const ins_yt = (yt_id, title, description, thumbnail, link, yt_link, timestamp) => {
	sql = `INSERT INTO youtube_posts (yt_id, title, description, thumbnail, link, yt_link, timestamp, created_at, updated_at) VALUES (${con.escape(yt_id)}, ${con.escape(unescape(encodeURIComponent(description)))}, ${con.escape(title)}, ${con.escape(thumbnail)}, ${con.escape(link)}, ${con.escape(yt_link)}, ${con.escape(timestamp)}, current_timestamp(), current_timestamp());`
	result = query(sql)
	log("DB", `Saved new video (${yt_id})`)
	return sql
}

const getSavedVideos = async () => {
	sql = 'SELECT `yt_id` FROM `youtube_posts` ORDER BY `timestamp` DESC LIMIT 30'
	const result = await query(sql)
	let data = []
	result.forEach((i) => {
		data.push(i.yt_id)
	})
	return data
}

const getSavedPosts = async () => {
	sql = 'SELECT `ig_id` FROM `instagram_posts` ORDER BY `timestamp` DESC LIMIT 30'
	const result = await query(sql)
	let data = [];
	result.forEach((i) => {
		data.push(i.ig_id)
	})
	return data
}

let sendedBumpReminder = false;

const checkBump = async () => {
	const disboardUrl = "https://disboard.org/server/761880306230886412";

	fetchData(disboardUrl).then((res) => {

		const html = res.data;
		const $ = cheerio.load(html);
		const lastBump = $('.server-bumped-at').text().split(' ');
		if ((lastBump[1] >= 2 && lastBump[2] === 'hours') || (lastBump[1] >= 1 && lastBump[2] === 'days') || (lastBump[1] >= 1 && lastBump[2] === 'day')) {
			if (!sendedBumpReminder) {
				const guild = client.guilds.cache.get(config.guildId);
				guild.channels.cache.get(config.channels.bump).send(`⁣<@&${config.rolesId.bump}>⁣\n\nJe opět možné bumpnout server!\nPoužij: \`/bump\`!`)
				log("Discord", `Sending bump reminder`)
				sendedBumpReminder = true;
			}
		} else {
			sendedBumpReminder = false
		}
	})


}

async function fetchData(url) {
	// make http call to url
	let response = await axios(url).catch((err) => console.log(err));

	if (response.status !== 200) {
		console.log("Error occurred while fetching data");
		return;
	}
	return response;
}


const log = (type, message) => {
	sql = `INSERT INTO logs (type, message, timestamp) VALUES (${con.escape(type)}, ${con.escape(message)}, current_timestamp());`
	result = query(sql)
	const guild = client.guilds.cache.get(config.guildId);

	if (type === "Discord" || type === "Web") {
		betterConsole.log(type, message, "green");
		started ? guild.channels.cache.get(config.channels.log).send(`LOG: ${type} - ${message}⁣`) : ""
	} else if (type === "Socials" || type == "DB") {
		betterConsole.log(type, message, "blue");
		started ? guild.channels.cache.get(config.channels.log).send(`LOG: ${type} - ${message}⁣`) : ""
	} else if (type === "Error" || type == "Discord Error") {
		betterConsole.log(type, message, "red");
		started ? guild.channels.cache.get(config.channels.log).send(`LOG: ${type} - ${message} \n ⁣<@&${config.rolesId.owner}>⁣⁣`) : ""
	} else {
		betterConsole.log(type, message, "cyan");
		started ? guild.channels.cache.get(config.channels.log).send(`LOG: ${type} - ${message}⁣`) : ""
	}

}

const heartbeat = async () => {
	sql = 'SELECT 1;'
	try {
		const result = await query(sql)
		console.log(result)
	} catch (e) {
		log("Error", `Heartbeat failed, error ${e}`)
		con.connect(function (err) {
			if (err) throw err;
			log("DB", `Connected`)
		});
	}
}