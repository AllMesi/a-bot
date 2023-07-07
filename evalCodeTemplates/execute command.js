const command = 'echo hello world';
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function shell() {
  const { stdout, stderr } = await exec(command);
  console.log(stdout);
}
shell();