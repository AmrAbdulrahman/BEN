let fs = require('fs');
let path = require('path');
let _ = require('lodash');

module.exports = (filePath) => {
  let file = fs.readFileSync(path.join(process.env.PWD, filePath)).toString();

  let list = file
    .split('\n') // split on blank lines
    .map((item) => item.replace(new RegExp('\n', 'ig'), '')); // remove trailing and leading 'newline'

  return _.filter(list, (item) => item); // remove empty items
};
