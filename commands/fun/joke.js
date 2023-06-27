const pop = require("popcat-wrapper");

module.exports = {
    description: "not very funny \"jokes\"",
    async execute(interaction) {
        await interaction.deferReply();
        pop.joke().then(text => {
            interaction.editReply(text);
        });
    },
};