module.exports = {
    async execute(interaction) {
        var rol = [];

        interaction.guild.roles.cache.forEach((role) => {
            if (role.name === "") {
                rol.push(role.id);
            }
        });

        interaction.reply(rol.sort((a, b) => a - b).map(id => `<@&${id}>`).join(""));
    },
};