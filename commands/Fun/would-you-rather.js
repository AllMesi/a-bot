const pop = require("popcat-wrapper");

module.exports = {
    description: "Would you rather...",
    async execute(interaction) {
        await interaction.deferReply();
        pop.wouldyourather().then(array => {
            interaction.editReply(`${array.ops1}\nor\n${array.ops2}`);
        });
    },
};