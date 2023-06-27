const { EmbedBuilder } = require('discord.js');

module.exports = {
    description: "Show stats about a bot",
    async execute(interaction) {
        const time24h = new Date().toLocaleString('en-AU', {
            hour12: true
        });
        let totalSeconds2 = (interaction.client.uptime / 1000);
        let days2 = Math.floor(totalSeconds2 / 86400);
        totalSeconds2 %= 86400;
        let hours2 = Math.floor(totalSeconds2 / 3600);
        totalSeconds2 %= 3600;
        let minutes2 = Math.floor(totalSeconds2 / 60);
        let seconds2 = Math.floor(totalSeconds2 % 60);
        var memUsage = 0;
        const mem = process.memoryUsage();
        memUsage = mem.heapTotal + mem.heapUsed;
        let uptime = `${days2} days, ${hours2} hours, ${minutes2} minutes and ${seconds2} seconds`;
        const embed = new EmbedBuilder()
            .setTitle('Stats')
            .setDescription(`**Date:** ${time24h}\n**Uptime:** ${uptime}\n**Ram usage:** ${+(memUsage / 1e+6).toFixed(2)}mb\n**Servers:** ${interaction.client.guilds.cache.size}\n**Channels:** ${interaction.client.channels.cache.size}\n**Discord.js version:** ${require("discord.js/package.json").version}`)
            .setColor(0x7289DA);

        interaction.reply({
            embeds: [embed]
        });
    },
};