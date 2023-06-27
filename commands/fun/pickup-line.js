module.exports = {
    description: "pickup",
    async execute(interaction) {
        await interaction.deferReply();
        fetch("https://api.popcat.xyz/pickuplines").then(result => {
            result.json().then(array => {
                interaction.editReply(array.pickupline);
            });
        });
    },
};