const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: "Show info about the bot",
    async execute(interaction) {
        const date = Date();
        const new_date = new Date(date);
        const hours = new_date.getHours();
        const minutes = new_date.getMinutes();
        const seconds = new_date.getSeconds();
        const time24h = (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
        let totalSeconds2 = (interaction.client.uptime / 1000);
        let days2 = Math.floor(totalSeconds2 / 86400);
        totalSeconds2 %= 86400;
        let hours2 = Math.floor(totalSeconds2 / 3600);
        totalSeconds2 %= 3600;
        let minutes2 = Math.floor(totalSeconds2 / 60);
        let seconds2 = Math.floor(totalSeconds2 % 60);
        let uptime = `${days2} days, ${hours2} hours, ${minutes2} minutes and ${seconds2} seconds`;
        const embed = new EmbedBuilder()
            .setTitle('Info')
            .setDescription(`Time: ${time24h}\nUptime: ${uptime}\nServers: ${interaction.client.guilds.cache.size}\nChannels: ${interaction.client.channels.cache.size}\nDiscord.js version: ${require("discord.js/package.json").version}`)
            .setColor(0xff2d00);

        interaction.reply({
            embeds: [embed]
        });
    },
};