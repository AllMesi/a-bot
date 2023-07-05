const { SlashCommandBuilder } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];

module.exports = {
    description: 'reloads a command',
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('command_name')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.reply("how dare you even TRY to use this command you mere mortal");
        const commandName = interaction.options.getString('command_name', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(`../${command.category}/${command.data.name}.js`);
            if (!("data" in newCommand)) {
                newCommand.data = new SlashCommandBuilder()
                    .setName(command.data.name);
            } else {
                newCommand.data.name = command.data.name;
            }
            newCommand.category = command.category;
            newCommand.data.description = command.data.description || command.description || "No description found";
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.stack}\``);
        }
    },
};