var mysql = require('../../../middleware/database')('mysql');


exports.getUser = function (req, res) {
    var userID = req.params.id;

    // 개인 정보
    var sql = "select id, email, nickname, tutor from User where id = ?";
    mysql.query(sql, userID, function (err, result) {
        if (err) {
            res.status(404).json({error: err})
        } else {
            res.status(200).json(result[0]);
        }
    });
};

exports.getClass = function (req, res) {
    var userID = req.params.id;

    // 내가 수강중인 목록
    var sql = "select * from Class where studentNick = ? or tutorNick = ? and status = 3";
    mysql.query(sql, [userID, userID], function (err, result) {
        if (err) {
            res.status(404).json({error: err})
        } else {
            if (!result.length) {
                res.status(401).json("수강중인 목록이 없습니다");
            } else {
                res.status(200).json(result);
            }
        }
    });

};

exports.getWriter = function(req, res) {
    var userID = req.params.id;

    // 신청온 목록
    var sql = "select * from Chat as ch, Class as c where ch.classNum = c.num and writer = ?";
    mysql.query(sql, userID, function (err, result) {
        if (err) {
            res.status(404).json({error: err})
        } else {
            if (!result.length) {
                res.status(401).json("신청한 받은 목록이 없습니다.");
            } else {
                res.status(200).json(result);
            }
        }
    });
};

exports.getApplicant = function(req, res){
    var userID = req.params.id;

    // 신청한 목록
    var sql = "select * from Chat as ch, Class as c where ch.classNum = c.num and applicant = ?";
    mysql.query(sql, userID, function(err, result){
        if (err) {
            res.status(404).json({ error: err })
        } else {
            if(!result.length) {
                res.status(401).json("신청한 목록이 없습니다.");
            } else {
                res.status(200).json(result);
            }
        }
    });
};