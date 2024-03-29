const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
const { Collection, AttachmentBuilder } = require('discord.js');
const { get } = require('sourcebin');
const blacklisted = ["1040762702756331551"];

module.exports = {
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            if (blacklisted.includes(interaction.user.id)) {
                return interaction.reply({
                    files: ["https://http.cat/403.jpg"]
                });
            }

            setTimeout(() => {
                if (!interaction.deferred && !interaction.replied) {
                    return interaction.reply({
                        files: ["https://http.cat/444.jpg"],
                        ephemeral: true
                    });
                }
            }, 1000);

            const command = interaction.client.commands.get(interaction.commandName);

            const { cooldowns } = interaction.client;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const cooldownAmount = (command.cooldown ?? 0) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);


            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error.stack);
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({
                        embeds: [
                            {
                                title: `Error executing /${interaction.commandName}!`,
                                description: `\`\`\`ansi\n\u001b[31mError!\u001b[0m\n\n${trim(error.stack, 1000)}\n\`\`\``,
                                color: 0xff0000
                            }
                        ]
                    });
                } else if (interaction.deferred && interaction.replied) {
                    await interaction.followUp({
                        embeds: [
                            {
                                title: `Error executing /${interaction.commandName}!`,
                                description: `\`\`\`ansi\n\u001b[31mError!\u001b[0m\n\n${trim(error.stack, 1000)}\n\`\`\``,
                                color: 0xff0000
                            }
                        ]
                    });
                } else if (!interaction.deferred && !interaction.replied) {
                    await interaction.reply({
                        embeds: [
                            {
                                title: `Error executing /${interaction.commandName}!`,
                                description: `\`\`\`ansi\n\u001b[31mError!\u001b[0m\n\n${trim(error.stack, 1000)}\n\`\`\``,
                                color: 0xff0000
                            }
                        ]
                    });
                }
            }
        } else if (interaction.isButton()) {
            let id = interaction.customId;
            if (id.startsWith("help-")) {
                id = id.slice(5);
                let categories = [];
                let commands = [];

                interaction.client.commands.forEach(command => {
                    if (command.category === id) {
                        commands.push(`</${command.name}:${command.id}> - ${command.description}`);
                    }
                });

                interaction.client.commands.forEach(command => {
                    if (!categories.includes(command.category)) {
                        categories.push(command.category);
                        if (command.category === "Owner") return;
                        if (id == command.category) {
                            interaction.update({
                                embeds: [{
                                    title: `Help (${command.category})`,
                                    description: commands.join("\n"),
                                    color: 0x7289DA
                                }]
                            });
                            return;
                        }
                    }
                });
            } else if (id.startsWith("reb-")) {
                id = id.slice(4);
                await interaction.deferReply({
                    ephemeral: true
                });
                const bin = await get({
                    key: id
                });
                const outputFile = new AttachmentBuilder(Buffer.from(JSON.stringify(bin.files[0].content), 'utf-8'), {
                    name: "export.json"
                });
                await interaction.editReply({
                    files: [outputFile]
                });
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    },
};