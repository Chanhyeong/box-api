var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/:mode/:chatNumber', controller.getMessageLog);
router.get('/list', jwtHandler.decodeToken, controller.getList);
router.put('/:mode/:chatNumber', controller.sendMessage);
router.delete('/');

module.exports = router;