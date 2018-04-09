import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

import { isUserExist, createUser, verifyUser, profile } from "./userDAL";
import { generateToken, tokenMiddleware } from "../Token";


const User = Router();

// Add middleware to get the body of request
User.use(bodyParser.json());
User.use(bodyParser.urlencoded({ extended: true }));

// Create new user
User.post('/register', sanitizeRegisterBody, async (req, res) => {

    const emailAddress = req.body.emailAddress;

    isUserExist(emailAddress).then(result => {
        return result === null ? true : false
    }).then(isUnique => {
        if (!isUnique) {
            throw new Error("UserAlreadyExistError")
        } else {
            return createUser(req.body)
        }
    }).then(createdUser => {
        const { password, ...userDetails } = createdUser.dataValues
        sendResponse(res, { message: userDetails })
    }).catch(err => {
        handleError(err, res)
    })

})

// Login a user
User.post('/login', sanitizeLoginBody, (req, res) => {
    const { password, emailAddress } = req.body

    const userCredentials = {
        password,
        emailAddress
    }

    verifyUser(userCredentials)
        .then(userDetails => {

            const payload = { id: userDetails.id }
            const generatedToken = generateToken(payload)

            const message = {
                message: "Successfully created a token, this can be used as an access pass for the API",
                token: generatedToken,
                emailAddress: userCredentials.emailAddress,
                dateCreated: new Date()
            }

            sendResponse(res, { message })

        }).catch(err => {
            handleError(err, res)
        })
})

User.get('/profile', tokenMiddleware, (req, res) => {
    profile(req.id).then(result => {
        sendResponse(res, { message: result.dataValues })
    }).catch(err => {
        console.log(err)
    })
})

// Gracefully handle errors
function handleError(err, res) {
    let responseMessage = null
    switch (err.message) {

        case "UserAlreadyExistError":
            responseMessage = { message: "User is already exist." }
            sendResponse(res, {
                message: responseMessage,
                status: 400
            });
            break;

        case "UserNotFoundError":
            responseMessage = { message: "Unauthorize access, user not found" }
            sendResponse(res, {
                message: responseMessage,
                status: 401
            });
            break;
        
        case "PasswordMatchError":
            responseMessage = { message: "Unauthorize access, password is invalid" }
            sendResponse(res, {
                message: responseMessage,
                status: 401
            });
            break;

        default:
            res.setHeader('Content-Type', 'application/json')
            res.status(500).end(JSON.stringify({ message: err.message }))
            break;
    }
}

// Verification middleware for registration body
function sanitizeRegisterBody(req, res, next) {

    if (typeof req.body.emailAddress !== "string") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "Email address must be passed and must be a string" }))
    } else if (typeof req.body.firstName !== "string") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "First Name must be passed and must be a string" }))
    } else if (typeof req.body.lastName !== "string") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "Last Name must be passed and must be a string" }))
    } else if (typeof req.body.password !== "string") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "Password must be passed and must be a string" }))
    } else if (req.body.password.length > 50) {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "Password must be 50 characters below" }))
    } else {
        next()
    }
}

// Verification middleware for login body
function sanitizeLoginBody(req, res, next) {
    if (typeof req.body.emailAddress !== "string") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "Email address must be passed and must be a string" }))
    } else if (typeof req.body.password !== "string") {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).end(JSON.stringify({ message: "Password must be passed and must be a string" }))
    } else {
        next()
    }
}

// Handle the response. Following the principle of DRY (Don't Repeat Yourself)
function sendResponse(res, { message, status = 200 }) {
    res.setHeader('Content-Type', 'application/json')
    res.status(status).end(JSON.stringify(message))
}
export default User;