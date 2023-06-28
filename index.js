require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const neatStack = require('neat-stack');
const { addCommands } = require("./addCommands");

// const pastebinAPI = require('pastebin-ts');
// global.pastebin = new pastebinAPI({
//     'api_dev_key': process.env.pastebin,
//     'api_user_name': 'PastebinUserName',
//     'api_user_password': 'PastebinPassword'
// });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

client.cooldowns = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

addCommands(client);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    event.basename = path.basename(filePath);
    event.name = event.name || event.basename.slice(event.basename + 1, -3);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

process.on("uncaughtException", (e) => {
    console.error(neatStack(e));
});

process.once('SIGINT', function () {
    client.user.setStatus('invisible');
    client.destroy();
});

process.once('SIGTERM', function () {
    client.user.setStatus('invisible');
    client.destroy();
});

client.login(process.env.token);
