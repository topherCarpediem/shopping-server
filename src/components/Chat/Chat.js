import { Router } from "express";

import models from "../../models";
import { tokenMiddleware } from "../Token";

const { Conversation, Room, Member, User } = models
const { Op } = models.Sequelize

const Chat = Router()

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


Chat.get('/conversation/:userId', tokenMiddleware, async (req, res) => {
    const peerId = req.params.userId
    const userId = req.id
    let roomId = null

    try {
        const memberInfo = await Member.findAll({
            where: {
                [Op.or]: {
                    user_id: [peerId, userId]
                }
            },
        })

        if (memberInfo.length === 0) {
            console.log('Creating room for the two user')
            roomId = await handleCreationOfRoom({ peerId, userId })
        } else {
            console.log('Check if the user have a common room id')
            roomId = await handleCheckingOfRoomIds({ peerId, userId, memberInfo })
        }

        console.log('Getting chat history')
        const conversationHistory = await handleConversationHistory(roomId)

        if (conversationHistory.length === 0) {
            console.log('No chat history found. Returning an error')
            res.setHeader('Content-type', 'application/json')
            res.status(404).end(JSON.stringify({
                message: "No conversation found"
            }))
            return
        } else {
            
            console.log('Returning chat histories')
            const conversationResult = conversationHistory.map(convo => {
                const { room_id, ...convoDetails } = convo.dataValues
                convo.dataValues = convoDetails
                const { password, ...userDetails } = convo.dataValues.user.dataValues
                convo.dataValues.user = userDetails
                return convo.dataValues
            })

            res.setHeader('Content-type', 'application/json')
            res.status(404).end(JSON.stringify({
                roomId,
                conversation: conversationResult
            }))
            return
        }
    } catch (error) {
        console.log(error)
    }
})
// ('6e93df28-7df3-473d-8907-4dccae4d4e6f', '55c73ff2-2f80-43dc-93e0-181ffff78073'));




async function handleCreationOfRoom({ peerId, userId }) {
    //console.log(peerId, userId)
    const room = await Room.create()
    const newMember = await Member.bulkCreate([
        {
            user_id: peerId,
            room_id: room.dataValues.id
        },
        {
            user_id: userId,
            room_id: room.dataValues.id
        }
    ])
    console.log(`Created room new room ${room.dataValues.id}`)
    return room.dataValues.id

}


async function handleCheckingOfRoomIds({ peerId, userId, memberInfo }) {
    let peerRoom = []
    let userRoom = []
    let roomId = null

    for (let index = 0; index < memberInfo.length; index++) {
        const member = memberInfo[index];
        //console.log(member.dataValues.r)
        if (peerId === member.dataValues.user_id) {
            peerRoom.push(member.dataValues.room_id)
        } else if (userId === member.dataValues.user_id) {
            userRoom.push(member.dataValues.room_id)
        }
    }

    if (peerRoom.length === 0) {
        console.log(`No roomId found in peerUser. Creating a room...`)
        roomId = await handleCreationOfRoom({ peerId, userId })
    } else if (userRoom.length === 0) {
        console.log(`No roomId found in user. Creating a room...`)
        roomId = await handleCreationOfRoom({ peerId, userId })
    } else {
        console.log(`Checking...`)
        roomId = handleCheckOfSameRoomId({ peerRoom, userRoom, peerId, userId })
    }

    return roomId

}


async function handleCheckOfSameRoomId({ peerRoom, userRoom }) {
    let roomId = null
    let breakCheck = false;

    for (let index = 0; index < peerRoom.length; index++) {
        const peerRoomId = peerRoom[index];
        for (let index = 0; index < userRoom.length; index++) {
            const userRoomId = userRoom[index];
            if (userRoomId === peerRoomId) {
                roomId = userRoomId
                breakCheck = true
                break;
            }
        }
        if (breakCheck) { break; }
    }

    if (roomId === null) {
        console.log('There is no common roomId found. Creating...')
        roomId = await handleCreationOfRoom({ peerId, userId })
        return roomId
    }
    console.log(`Common roomId found ${roomId}`)
    return roomId
}


async function handleConversationHistory(roomId) {
    const conversation = await Conversation.findAll({
        where: {
            room_id: roomId
        },
        include: [{
            model: User,
            required: true
        }]
    })

    return conversation
}

export default Chat