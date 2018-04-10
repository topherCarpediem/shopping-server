"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

// ('6e93df28-7df3-473d-8907-4dccae4d4e6f', '55c73ff2-2f80-43dc-93e0-181ffff78073'));


let handleCreationOfRoom = (() => {
    var _ref2 = _asyncToGenerator(function* ({ peerId, userId }) {
        //console.log(peerId, userId)
        const room = yield Room.create();
        const newMember = yield Member.bulkCreate([{
            user_id: peerId,
            room_id: room.dataValues.id
        }, {
            user_id: userId,
            room_id: room.dataValues.id
        }]);
        console.log(`Created room new room ${room.dataValues.id}`);
        return room.dataValues.id;
    });

    return function handleCreationOfRoom(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

let handleCheckingOfRoomIds = (() => {
    var _ref3 = _asyncToGenerator(function* ({ peerId, userId, memberInfo }) {
        let peerRoom = [];
        let userRoom = [];
        let roomId = null;

        for (let index = 0; index < memberInfo.length; index++) {
            const member = memberInfo[index];
            //console.log(member.dataValues.r)
            if (peerId === member.dataValues.user_id) {
                peerRoom.push(member.dataValues.room_id);
            } else if (userId === member.dataValues.user_id) {
                userRoom.push(member.dataValues.room_id);
            }
        }

        if (peerRoom.length === 0) {
            console.log(`No roomId found in peerUser. Creating a room...`);
            roomId = yield handleCreationOfRoom({ peerId, userId });
        } else if (userRoom.length === 0) {
            console.log(`No roomId found in user. Creating a room...`);
            roomId = yield handleCreationOfRoom({ peerId, userId });
        } else {
            console.log(`Checking...`);
            roomId = handleCheckOfSameRoomId({ peerRoom, userRoom, peerId, userId });
        }

        return roomId;
    });

    return function handleCheckingOfRoomIds(_x4) {
        return _ref3.apply(this, arguments);
    };
})();

let handleCheckOfSameRoomId = (() => {
    var _ref4 = _asyncToGenerator(function* ({ peerRoom, userRoom }) {
        let roomId = null;
        let breakCheck = false;

        for (let index = 0; index < peerRoom.length; index++) {
            const peerRoomId = peerRoom[index];
            for (let index = 0; index < userRoom.length; index++) {
                const userRoomId = userRoom[index];
                if (userRoomId === peerRoomId) {
                    roomId = userRoomId;
                    breakCheck = true;
                    break;
                }
            }
            if (breakCheck) {
                break;
            }
        }

        if (roomId === null) {
            console.log('There is no common roomId found. Creating...');
            roomId = yield handleCreationOfRoom({ peerId, userId });
            return roomId;
        }
        console.log(`Common roomId found ${roomId}`);
        return roomId;
    });

    return function handleCheckOfSameRoomId(_x5) {
        return _ref4.apply(this, arguments);
    };
})();

let handleConversationHistory = (() => {
    var _ref5 = _asyncToGenerator(function* (roomId) {
        const conversation = yield Conversation.findAll({
            where: {
                room_id: roomId
            },
            include: [{
                model: User,
                required: true
            }]
        });

        return conversation;
    });

    return function handleConversationHistory(_x6) {
        return _ref5.apply(this, arguments);
    };
})();

var _express = require("express");

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _Token = require("../Token");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { Conversation, Room, Member, User } = _models2.default;
const { Op } = _models2.default.Sequelize;

const Chat = (0, _express.Router)();

// Chat.get('/history', tokenMiddleware, async (req, res) => {
//     Conversation.findAll({
//         where: {
//             user_id: req.id
//         },
//         group: "room_id",
//         include: [{
//             model: User,
//             required: true
//         }]
//     }).then(result => {
//         result = result.map(convo => {
//             return convo.dataValues
//         })

//         console.log(result)
//     })
// })


Chat.get('/conversation/:userId', _Token.tokenMiddleware, (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
        const peerId = req.params.userId;
        const userId = req.id;
        let roomId = null;

        try {
            const memberInfo = yield Member.findAll({
                where: {
                    [Op.or]: {
                        user_id: [peerId, userId]
                    }
                }
            });

            if (memberInfo.length === 0) {
                console.log('Creating room for the two user');
                roomId = yield handleCreationOfRoom({ peerId, userId });
            } else {
                console.log('Check if the user have a common room id');
                roomId = yield handleCheckingOfRoomIds({ peerId, userId, memberInfo });
            }

            console.log('Getting chat history');
            const conversationHistory = yield handleConversationHistory(roomId);

            if (conversationHistory.length === 0) {
                console.log('No chat history found. Returning an error');
                res.setHeader('Content-type', 'application/json');
                res.status(404).end(JSON.stringify({
                    message: "No conversation found"
                }));
                return;
            } else {

                console.log('Returning chat histories');
                const conversationResult = conversationHistory.map(function (convo) {
                    const _convo$dataValues = convo.dataValues,
                          { room_id } = _convo$dataValues,
                          convoDetails = _objectWithoutProperties(_convo$dataValues, ["room_id"]);
                    convo.dataValues = convoDetails;
                    const _convo$dataValues$use = convo.dataValues.user.dataValues,
                          { password } = _convo$dataValues$use,
                          userDetails = _objectWithoutProperties(_convo$dataValues$use, ["password"]);
                    convo.dataValues.user = userDetails;
                    return convo.dataValues;
                });

                res.setHeader('Content-type', 'application/json');
                res.status(404).end(JSON.stringify({
                    roomId,
                    conversation: conversationResult
                }));
                return;
            }
        } catch (error) {
            console.log(error);
        }
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})());exports.default = Chat;