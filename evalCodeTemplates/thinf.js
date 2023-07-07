let arr = [];
for (let i = 0; i <= 1000; i++) {
  arr.push(i);
}
console.log(new Buffer(arr).toString('ascii'));