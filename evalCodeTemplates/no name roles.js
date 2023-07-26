/* eslint-disable no-undef */
const roles = interaction.guild.roles.cache.filter(role => role.name === "");
let vis = [];
roles.forEach(role => {
  vis.push(role.id);
});
vis.sort();
vis = vis.map(id => `<@&${id}>`);
interaction.followUp(vis.join(""));