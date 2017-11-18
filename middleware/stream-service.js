var streamSocket = null;
var rooms = {};
var roomId = null;
var socketIds = {};

function findRoomBySocketId(value) {
    console.log("value", value)
    var arr = Object.keys(rooms);
    var result = null;
    for (var i=0; i<arr.length; i++) {
        if (rooms[arr[i]][value]) {
            result = arr[i];
            break;
        }
    }

    console.log('나간 룸', result);
    return result;
}

exports.init = function (io) {
    streamSocket = io.of('/stream');
    streamSocket.on('connection', function(socket) {
        console.log('on stream connection');

        socket.on('joinRoom', function(roomName, userId) {
            console.log("join stream", roomName, userId)
            roomId = roomName;
            socket.join(roomId);  // 소켓을 특정 room에 binding합니다.

            // 룸에 사용자 정보 추가
            // 이미 룸이 있는경우
            if (rooms[roomId]) {
                // console.log('이미 룸이 있는 경우');
                rooms[roomId][socket.id] = userId;
                // 룸 생성 후 사용자 추가
            } else {
                console.log('룸 추가');
                rooms[roomId] = {};
                rooms[roomId][socket.id] = userId;
            }
            var thisRoom = rooms[roomId];
            console.log('thisRoom', thisRoom);

            // 유저 정보 추가
            socket.emit('joinRoom', roomId, thisRoom);
            //console.log('ROOM LIST', io.sockets.adapter.rooms);
            console.log('ROOM LIST', rooms);
        });


        // 메시징
        socket.on('message', function(data) {
            //console.log('message: ' + data);

            if (data.to == 'all') {
                // for broadcasting without me
                socket.broadcast.to(data.roomId).emit('message', data);
            } else {
                // for target user
                var targetSocketId = socketIds[data.to];
                if (targetSocketId) {
                    io.to(targetSocketId).emit('message', data);
                }
            }
        });

        // socket disconnect
        socket.on('disconnect', function() {
            console.log('a user disconnected', socket.id);
            var roomId = findRoomBySocketId(socket.id);
            if (roomId) {
                socket.broadcast.to(roomId).emit('leaveRoom', rooms[roomId][socket.id]); // 자신 제외 룸안의 유저ID 전달
                delete rooms[roomId][socket.id]; // 해당 유저 제거
            }
        });

    });
};