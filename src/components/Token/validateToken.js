import jwt from "jsonwebtoken"

export default (token) => {
    const secretKey = "5e3cdc509e6c91feb9cedd4669441864a9e65b60c057c3cb00c18a0c61eece8d0d2b74612003ca7b22bde779695bc97aed33b1949cea1235192e15d6d22511d6"
    const bufferedSecretKey = new Buffer(secretKey, "base64")
    const options = {
        algorithm: "HS256",
        audience: "https://bsushopping.com",
        issuer: "https://bsushopping.com",

    }


    let result = {
        type: "",
        data: {}
    }

    jwt.verify(token, bufferedSecretKey, options, (err, decoded) => {
        if(err === null){
            result.type = "authenticated"
            result.data = {...decoded}
        }
        else {
            result.type = "unauthorized"
            result.data = { message: err.message}
        }
    })

    //console.log(result)
    return result
}