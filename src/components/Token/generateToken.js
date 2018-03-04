import jwt from "jsonwebtoken"
import ms from "ms"

export default (payload) => {
    const secretKey = "5e3cdc509e6c91feb9cedd4669441864a9e65b60c057c3cb00c18a0c61eece8d0d2b74612003ca7b22bde779695bc97aed33b1949cea1235192e15d6d22511d6"
    const bufferedSecretKey = new Buffer(secretKey, "base64")
    const options = {
        algorithm: "HS256",
        expiresIn: ms("2 days"),
        audience: "https://bsushopping.com",
        issuer: "https://bsushopping.com"
    }
    

    return jwt.sign(payload, bufferedSecretKey, options)
}