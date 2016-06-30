'use strict';
var fs = require('fs');

var a = { data: []}, b = [], i = 10, hasFriends = false;

while (i--){
    hasFriends = !hasFriends;
    a.data.unshift({id:i+1, name:'name' + i});
    b.unshift({id: i+1, hasFriends: hasFriends});
}

fs.writeFileSync('./demo/data/1.json', JSON.stringify(a, null, 2), 'utf8');
fs.writeFileSync('./demo/data/2.json', JSON.stringify(b, null, 2), 'utf8');