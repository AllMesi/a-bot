const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

function addCommands() {
    client.commands = new Collection();
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if (!("data" in command)) {
                command.data = new SlashCommandBuilder()
                    .setName(path.basename(filePath, ".js"));
            } else {
                command.data.name = path.basename(filePath, ".js");
            }
            if ('execute' in command) {
                command.category = filePath.slice(__dirname.length + 1 + ("commands/").length, -3 - command.data.name.length - 1); // kinda hacky i think
                command.data.description = command.data.description || command.description || "No description found";
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "execute" property.`);
            }
        }
    }
}

addCommands();

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    event.basename = path.basename(filePath);
    event.name = event.basename.slice(event.basename + 1, -3);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

process.on("uncaughtException", (e) => {
    console.error(e);
});

process.once('SIGINT', function (code) {
    console.log('SIGINT received...');
    client.user.setStatus('invisible');
    client.destroy();
    console.log(`Process exited with code ${code}`);
});
process.once('SIGTERM', function (code) {
    console.log('SIGTERM received...');
    client.user.setStatus('invisible');
    client.destroy();
    console.log(`Process exited with code ${code}`);
});

// client.on('debug', console.log)
//     .on('warn', console.log);

module.exports = addCommands;

client.login(fs.readFileSync("token.txt", "utf8"));
