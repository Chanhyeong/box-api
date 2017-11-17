var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb').chatDb;

exports.getMessages = function (nickname, callback) {
    var statement = "select num, writer, applicant from Chat where writer = ? OR applicant = ?;";
    var filter = [nickname, nickname];

    mysql.query(statement, filter, callback);
};

// 특정 Document의 message 반환
// result 값이 router로 전달되지 않아서 callback으로 설계
// mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)
exports.getMessage = function (mode, chatNumber, callback) {
    mongodb(function (db) {
        db.collection(mode).findOne( { _id : chatNumber }, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });

        db.close();
    });
};

// 기존 Document에 메시지 추가
exports.insertMessage = function (mode, chatNumber, message, callback) {
    mongodb(function (db) {
        db.collection(mode).update( { _id: chatNumber }, {
            $push: { log: message }
        }, function (err){
            callback(err);
        });

        db.close();
    });
};

// 매칭 신청 시 + 매칭 완료 시 각각의 채팅방 생성, 관리자 안내 메시지 추가
// mode: 'matching', 'class'
exports.create = function (mode, data, time, callback) {
    var statement= "insert into Chat SET ?";

    mysql.query(statement, data, function (err, result) {
        if (err) {
            callback(err);
        } else {
            var form = {
                _id: result.insertId,
                log: [
                    {
                        id: 'admin',
                        message: '여기서 강의 내용에 대한 질문/답변을 진행하세요.',
                        date: time
                    }
                ]
            };

            mongodb(function (db) {
                db.collection(mode).insert(form, function (err) {
                    callback(err);
                });

                db.close();
            });
        }
    });
};

exports.delete = function (num, callback) {
    mongodb(function (db) {
        db.collection('matching').delete({_id: num}, function (err) {
            callback(err);
        });
    });
};
