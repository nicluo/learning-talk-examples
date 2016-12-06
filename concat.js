#!/usr/local/bin/node
var fs = require('fs');

var count = process.argv[2];
var combined = [];

for(var i=1; i<=count; i++){
  var issues = require('./issues-' + i + '.json');
  combined = combined.concat(issues);
}

fs.writeFileSync('combined.json', JSON.stringify(combined, null, 2), 'utf8');
