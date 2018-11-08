import { sprintf } from 'sprintf-js'
const util = require('util');
global.util = util 
function m(money, cc) {
    return util.format("%s %s", Number((money | 0) / 100).toFixed(2), cc);
}
function m2(money) { // without the CC
    return sprintf("%s", Number((money | 0) / 100).toFixed((2)));
}

export {
    m,
    m2
}