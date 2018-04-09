import { Router } from "express";

import models from "../../models";
import tokenMiddleware from "../Token";

const { Conversation, Room, Member }= models


const Chat = Router()


Chat.get('/hostories', (req, res) => {

    

})


Chat.get('/:roomId', tokenMiddleware, (req, res) => {
    const peerId = req.body.userId
    const userId = req.id


    
})