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
        const date = new Date();
        client.user.setActivity(`${client.guilds.cache.size} servers${(date.getMonth() + 1 === 7 /*july*/ && date.getDate() === 27 /*27th day of july*/ ? " | ITS 727 DAY!!" : (date.getMonth() + 1 === 7 /*july*/ ? ` | ${27 - date.getDate()} days until 727 day` : ""))}`, { type: ActivityType.Watching });
        setInterval(() => {
            const date = new Date();
            client.user.setActivity(`${client.guilds.cache.size} servers${(date.getMonth() + 1 === 7 /*july*/ && date.getDate() === 27 /*27th day of july*/ ? " | ITS 727 DAY!!" : (date.getMonth() + 1 === 7 /*july*/ ? ` | ${27 - date.getDate()} days until 727 day` : ""))}`, { type: ActivityType.Watching });
            // client.user.setActivity(`${client.guilds.cache.size} servers`, { type: ActivityType.Watching });
        }, 60000);
        // client.user.setActivity(`${client.guilds.cache.size} servers | ITS 727 DAY!!`);
        console.log(`Ready! Logged in as ${client.user.username}`);
    },
};
