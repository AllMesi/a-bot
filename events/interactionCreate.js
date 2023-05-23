const { Collection } = require('discord.js');

module.exports = {
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
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
                console.error(error);
                // console.error(typeof error);
                // console.error(error.toString());
                // console.error(JSON.stringify(error));
                // console.error(convertToText(error));
                // console.error(error.stack);
                await interaction.reply({
                    embeds: [
                        {
                            title: `Error executing /${interaction.commandName}!`,
                            description: `\`\`\`ansi\n\u001b[31m${error.stack}\u001b[0m\n\`\`\``,
                            color: 0xff0000
                        }
                    ]
                });
            }
        } else if (interaction.isButton()) {
            const id = interaction.customId;
            var categories = [];
            var commands = [];

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
                                color: 0xff2d00
                            }]
                        });
                        return;
                    }
                }
            });
        }
    },
};
