var mysql = require('../../../../middleware/database')('mysql');

exports.update = function (mode, classNumber, data) {
    switch (mode) {
        case 'create':
            break;
        case 'rename':
            break;
        case 'delete':
            break;
        case 'move':
            break;
        default: console.log('wrong mode'); return false;
    }
};