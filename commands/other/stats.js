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
        var memUsage = 0;
        const mem = process.memoryUsage();
        memUsage = mem.heapTotal + mem.heapUsed;
        let uptime = `${days2} days, ${hours2} hours, ${minutes2} minutes and ${seconds2} seconds`;
        const embed = new EmbedBuilder()
            .setTitle('Info')
            .setDescription(`**Time:** ${time24h}\n**Uptime:** ${uptime}\n**Ram usage:** ${+(memUsage / 1e+6).toFixed(2)}mb\n**Servers:** ${interaction.client.guilds.cache.size}\n**Channels:** ${interaction.client.channels.cache.size}\n**Discord.js version:** ${require("discord.js/package.json").version}`)
            .setColor(0xff2d00);

        interaction.reply({
            embeds: [embed]
        });
    },
};