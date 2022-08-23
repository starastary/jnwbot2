const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fun')
    .setDescription('Sends you a meme or something :D')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The fun category')
        .setRequired(true)
        .addChoices(
          { name: 'Meme', value: 'meme' },
          { name: 'Cat', value: 'cat' },
          { name: 'Dog', value: 'dog' },
          { name: 'Quote', value: 'quote' },
          { name: 'Food', value: 'food' },
          { name: 'Movie', value: 'movie' }
        )),


  async execute(client, interaction) {
    const category = interaction.options.getString('category')

    if (category === "meme") {

      axios.get('https://meme-api.herokuapp.com/gimme').then(resp => {
        const Embed = new MessageEmbed()
          .setColor(config.colors.embedMemeColor)
          .setTitle('Random meme')
          .setURL(resp.data.postLink)
          .setImage(resp.data.url)
          .setTimestamp()
          .setFooter({ text: `https://jaknaweby.eu`, iconURL: 'https://jaknaweby.eu/img/Logo.png' });

        interaction.reply({
          embeds: [Embed]
        })
      });

    } else if (category === "cat") {
      axios.get('https://api.thecatapi.com/v1/images/search').then(resp => {
        const Embed = new MessageEmbed()
          .setColor(config.colors.embedMemeColor)
          .setTitle('Cat :3')
          .setURL('https://api.thecatapi.com/v1/images/search')
          .setImage(resp.data[0].url)
          .setTimestamp()
          .setFooter({ text: `https://jaknaweby.eu`, iconURL: 'https://jaknaweby.eu/img/Logo.png' });

        interaction.reply({
          embeds: [Embed]
        })
      });
    } else if (category === "dog") {
      axios.get('https://dog.ceo/api/breeds/image/random').then(resp => {
        const Embed = new MessageEmbed()
          .setColor(config.colors.embedMemeColor)
          .setTitle('Dog')
          .setURL('https://dog.ceo/api/breeds/image/random')
          .setImage(resp.data.message)
          .setTimestamp()
          .setFooter({ text: `https://jaknaweby.eu`, iconURL: 'https://jaknaweby.eu/img/Logo.png' });

        interaction.reply({
          embeds: [Embed]
        })
      });
    } else if (category === "quote") {
      axios.get('http://api.quotable.io/random').then(resp => {
        const Embed = new MessageEmbed()
          .setColor(config.colors.embedMemeColor)
          .setTitle('Quote')
          .setURL('http://api.quotable.io/random')
          .setDescription(resp.data.content)
          .addFields(
            { name: resp.data.author, value: '\u200B' }
          )
          .setTimestamp()
          .setFooter({ text: `https://jaknaweby.eu`, iconURL: 'https://jaknaweby.eu/img/Logo.png' });

        interaction.reply({
          embeds: [Embed]
        })
      });
    } else if (category === "food") {
      axios.get('https://foodish-api.herokuapp.com/api/').then(resp => {
        const Embed = new MessageEmbed()
          .setColor(config.colors.embedMemeColor)
          .setTitle('Food')
          .setURL('https://foodish-api.herokuapp.com/api/')
          .setImage(resp.data.image)
          .setTimestamp()
          .setFooter({ text: `https://jaknaweby.eu`, iconURL: 'https://jaknaweby.eu/img/Logo.png' });

        interaction.reply({
          embeds: [Embed]
        })
      });
    } else if (category === "movie") {
      axios.get('https://k2maan-moviehut.herokuapp.com/api/random').then(resp => {
        const Embed = new MessageEmbed()
          .setColor(config.colors.embedMemeColor)
          .setTitle('Movie')
          .setURL('https://k2maan-moviehut.herokuapp.com/api/random')
          .setDescription(resp.data.name)
          .addFields(
            { name: 'Genre', value: ' ' + resp.data.genre, inline: true },
            { name: 'Director', value: ' ' + resp.data.director, inline: true },
            { name: 'IMDb rating', value: ' ' + resp.data.imdbRating, inline: true },
          )
          .setTimestamp()
          .setFooter({ text: `https://jaknaweby.eu`, iconURL: 'https://jaknaweby.eu/img/Logo.png' });

        interaction.reply({
          embeds: [Embed]
        })
      });
    }


  },
};
