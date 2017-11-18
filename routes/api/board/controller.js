var model = require('./model');
var chatModel = require('../chat/model');

exports.getClasses = function (req, res) {
    model.getClasses( function (err, result) {
        // TODO: 테스트 코드라서 에러가 안나면 이대로 두고 아니면 고치기
        process.nextTick( function() {
            if (err) {
                console.log('DB select err: ', err);
                res.status(500).send('Err: DB select Error');
            } else {
                res.status(200).json({
                    list: result
                });
            }
        });
    });
};

exports.getClass = function (req, res) {
    model.getInstance(req.params.num, function (err, result) {
        if (err) {
            console.log('DB select err: ', err);
            res.status(500).send('Err: DB select Error');
        } else{
            res.status(200).json({
                list: result
            });
        }
    });
};

exports.create = function (req, res) {
    var data = req.body;

    model.create(req.user.nickname, data, function (err) {
        if (Number.isInteger(err)) {
            switch (err) {
                case 400: res.status(400).send('Check the \'status\' number'); break;
                case 409: res.status(409).send('동일 제목한 제목으로 이미 게시글을 생성하였습니다.');
            }
        } else if (err) {
            console.log('DB err: ', err);
            res.status(500).send('Err: DB select Error');
        } else {
            res.status(200).send();
        }
    })
};

// 게시된 클래스에 매칭 신청 시 채팅방 생성
exports.request = function (req, res) {
    var data = req.body;
    data['applicant'] = req.user.nickname;

    var time = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    chatModel.create('matching', data, time, function (err) {
        if (err) {
            console.log('DB insert err: ', err);
            res.status(500).send('Err: DB insert Error');
        } else {
            res.status(200).send();
        }
    });
};

//TODO: 글 수정 api
exports.modify = function (req, res) {
    if(req.user.nickname !== req.body.nickname) {
        res.status(401).send('권한없음: 작성자가 아닙니다.');
    }
};

exports.delete = function (req, res) {
    model.delete(req.user.nickname, req.params.num, function (err) {
        if (Number.isInteger(err)) {
            switch (err) {
                case 400: res.status(400).send('Check the \'status\' number'); break;
                case 401: res.status(401).send('권한없음: 작성자가 아닙니다.');
            }
        } else if (err) {
            console.log ('DB delete err: ', err);
            res.status(500).send('Err: DB delete Error');
        } else {
            res.status(200).send();
        }
    });
};