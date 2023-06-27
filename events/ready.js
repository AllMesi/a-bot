const { ActivityType } = require("discord.js");

module.exports = {
    once: true,
    execute(client) {
        client.application.commands.fetch().then(commands => {
            commands.forEach(command => {
                client.commands.get(command.name).name = command.name;
                client.commands.get(command.name).id = command.id;
                client.commands.get(command.name).description = command.description;
            });
        });
        client.user.setStatus('idle');
        client.user.setActivity(`over ${client.guilds.cache.size} servers`, { type: ActivityType.Watching });
        setInterval(() => {
            client.user.setActivity(`over ${client.guilds.cache.size} servers`, { type: ActivityType.Watching });
        }, 60000);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
