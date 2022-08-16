const readLine = require('readline');
const AsciiTable = require('ascii-table');
const req = require('./request');
const apps = require('./apps.json');

require('colors');
require('dotenv').config();

const exit = () => {
  console.log('\nExiting...');
  rl.close();
  process.exit();
};

const copy = (text) => {
  require('child_process').spawn('clip').stdin.end(text);
  console.log(`Copied to clipboard: `.green + text.blue);
};

var token = '';

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('DISCORD TOKEN: ', (answer) => {
  if (answer) {
    token = answer;
    process.stdout.write('\x1Bc'); // clear the screen
    printActivityTable();
    question();
  } else {
    process.stdout.write('\x1Bc');
    console.log('No token provided.'.red);
    exit();
  }
});

const printActivityTable = () => {
  let table = new AsciiTable();

  table.setHeading('Activity', 'ID');
  for (let key in apps) {
    table.addRow(key, apps[key]);
  }
  console.log(table.toString().red);
};

const question = () => {
  console.log(
    'What channel do you want to create the activity in?:\n'.underline.magenta +
      '(Channel ID) (Activity Type)'.blue
  );
  rl.question('', async (answer) => {
    const args = answer.split(' ');

    if (!args[0]) {
      return question();
    }

    if (!args[1]) {
      args[1] = 'youtube';
    }

    if (answer === 'exit') {
      return exit();
    }

    const invite = await req(token, args[0], args[1]);
    if (!invite) return exit();
    copy(`<${invite}>`);
    question();
  });
};
