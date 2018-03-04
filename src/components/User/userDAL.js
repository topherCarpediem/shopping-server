import models from "../../models"
import bcrypt from "bcrypt"

const { User } = models

// Find one user with exact emailAddress
async function isUserExist(emailAddress) {
    const res = await User.findOne({
        where: {
            emailAddress
        }
    })
    return res
}

// Insert user in the database
async function createUser(args) {
    console.log(args)
    const userDetails = args
    userDetails.password = hashPassword(userDetails.password)
    const userCreation = await User.create(userDetails)
    return userCreation
}

// Verify if the user exist in the record
async function verifyUser(args) {

    const emailAddress = args.emailAddress
    const password = args.password

    const queryResult = await isUserExist(emailAddress)

    if (queryResult === null) {
        throw new Error("UserNotFoundError")
    }

    const isPasswordMatch = await bcrypt.compare(password, queryResult.dataValues.password)

    if (!isPasswordMatch) {
        throw new Error("PasswordMatchError")
    } else {
        return queryResult.dataValues
    }
}

// Hash the password using bcrypt with saltRound of 12
function hashPassword(plainPassword) {
    const saltRound = 12;
    return bcrypt.hashSync(plainPassword, saltRound)
}

export { isUserExist, createUser, verifyUser }