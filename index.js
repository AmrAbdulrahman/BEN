let _ = require('lodash');
let say = require('./say');
let wolfram = require('./wolfram');
let terminal = require('terminal-kit').terminal;
let stdin = process.openStdin();

say('Good morning Amr!');

function startSession(query = null) {
  cursor();

  if (query) {
    terminal(query + '\n');
    processQuery(query).then(cursor);
  }

  // listen to stdin
  stdin.addListener('data', (data) => {
    let query = data.toString().trim();
    processQuery(query).then(cursor);
  });
}

function cursor() {
  terminal.brightBlack('\n' + _.repeat('.', 80) + '\n');
  terminal.bold.blue('> ');
}

function processQuery(query) {
  return wolfram(query);
}

let initialQuery = null;

if (process.argv.length >= 3) {
  initialQuery = _.drop(process.argv, 2); // skip "node" and "ben"
  initialQuery = _.join(initialQuery, ' ');
}

startSession(initialQuery);
