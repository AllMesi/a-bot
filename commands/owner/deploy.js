const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const allowed = ["956156042398556210"];
const { addCommands } = require("../../addCommands");

module.exports = {
    description: 'redeploy all commands',
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) {
            return interaction.reply({
                files: ["https://http.cat/403.jpg"]
            });
        }
        await interaction.deferReply();
        const command = 'node deploy-commands.js';

        async function shell() {
            const { stdout, stderr } = await exec(command);
            return [stdout, stderr];
        }
        const commands = interaction.client.commands;
        for (const command of commands) {
            if (typeof command.data !== "undefined") {
                delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];
                interaction.client.commands.delete(command.data.name);
            }
        }
        shell().then(([stdout]) => {
            interaction.editReply(stdout);
            addCommands(interaction.client);
        });
    },
};