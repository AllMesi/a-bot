const fs = require('fs');

let fileName = 'Example';

let code = `
    console.log('Example');
    // add your code here
`;

fs.writeFileSync(`./evalCodeTemplates/${fileName}.js`, code);