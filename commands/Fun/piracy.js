module.exports = {
    async execute(interaction) {
        return interaction.reply({
            files: ["https://http.cat/451.jpg"]
        });
    },
};