const { ActivityType } = require("discord.js");

module.exports = {
    once: true,
    execute(client) {
        client.user.setActivity(`over ${client.guilds.cache.size} servers`, { type: ActivityType.Watching });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
