let _ = require('lodash');
let colors = require('colors');
let say = require('./say');
let wolfram = require('./wolfram');

var argv = require('yargs')
  .default('session', true) // start interactive session or not
  .argv;

function startSession(query = null) {
  cursor();

  if (query) {
    console.log(query);
    processQuery(query).then(cursor);
  }

  // listen to stdin
  process.stdin.on('data', (data) => {
    let query = data.toString().trim();
    processQuery(query).then(cursor);
  });
}

function cursor() {
  process.stdout.write(_.repeat('.', 80).cyan + '\n');
  process.stdout.write('> '.cyan.bold);
}

function processQuery(query) {
  return wolfram(query);
}

let initialQuery = _.reduce(process.argv, (query, arg) => {
  if (_.startsWith(arg, '--') || arg.indexOf('/node') > 0 || arg.indexOf('/ben') > 0) {
    return query;
  }

  return query + ' ' + arg;
}, '').trim();

require('./greeting')({silent: initialQuery})
  .then(() => {
    if (argv.session) {
      startSession(initialQuery);
    }
  })
