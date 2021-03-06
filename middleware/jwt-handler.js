var jwt = require('jsonwebtoken');

var SECRET = require('../config').jwtSecret;

exports.signToken = function (user) {
    return jwt.sign({ user: user }, SECRET);
};

// 토큰을 해독한 후, 사용자 ID를 request에 추가합니다.
exports.decodeToken = function (req, res, next) {
    if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer' + req.query.access_token;
    }

    var token = '';

    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];

    if (token) {
        // 토큰을 해독한 후, 사용자 정보(id)를 request에 추가합니다.
        jwt.verify(token, SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send('사용자 인증에 실패했습니다.');
            } else {
                req.user = decoded.user;
                next();
            }
        })
    }
    else {
        res.status(403).send('토큰이 필요합니다.')
    }
};
