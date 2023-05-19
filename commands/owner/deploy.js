const allowed = ["956156042398556210", "675492571203764236"];
const { exec } = require("child_process");

module.exports = {
    description: 'redeploys all commands',
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.editReply("how dare you even TRY to use this command you mere mortal");
        exec("node deploy-commands.js", (err, stdout) => {
            interaction.reply(stdout);
        });
    },
};