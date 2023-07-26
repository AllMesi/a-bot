/* eslint-disable no-undef */
const str = `◜
◝
◞
◟`;
const arr = str.split("\n");
let i = 0;
interaction.channel.send(arr[i]).then(message => {
  let interval;
  interval = setInterval(() => {
    i++;
    if (i >= 9) {
      clearInterval(interval);
      return message.delete();
    }
    message.edit(arr[i % 4]);
  }, 1000);
});