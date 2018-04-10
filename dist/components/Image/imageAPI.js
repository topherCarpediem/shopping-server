"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Image = (0, _express.Router)();

// ======================================================
// * * * * * * * * * * Download image * * * * * * * * * *
// ======================================================
Image.get("/download/:imagename", (req, res) => {

    let filePath = _path2.default.join(process.cwd(), `uploads/${req.params.imagename}`);
    const myReadStream = _fs2.default.createReadStream(filePath);

    myReadStream.on("error", error => {
        console.log("Returning invalid image because image not found");
        filePath = _path2.default.join(process.cwd(), `src/images/error.PNG`);
        _fs2.default.createReadStream(filePath).pipe(res);
    });
    res.setHeader("Content-type", "image/png");
    myReadStream.pipe(res);
});

exports.default = Image;