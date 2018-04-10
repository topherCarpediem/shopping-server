import { Router } from "express";
import path from "path"
import fs from "fs"
const Image = Router()


// ======================================================
// * * * * * * * * * * Download image * * * * * * * * * *
// ======================================================
Image.get("/download/:imagename", (req, res) => {

    let filePath = path.join(process.cwd(), `uploads/${req.params.imagename}`)
    const myReadStream = fs.createReadStream(filePath)

    myReadStream.on("error", error => {
        console.log("Returning invalid image because image not found")
        filePath = path.join(process.cwd(), `src/images/error.PNG`)
        fs.createReadStream(filePath).pipe(res)
    })
    res.setHeader("Content-type", "image/png")
    myReadStream.pipe(res)
})


export default Image
