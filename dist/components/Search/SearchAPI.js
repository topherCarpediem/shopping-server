"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _SearchDAL = require("./SearchDAL");

const Search = (0, _express.Router)();

Search.get('/:keyword', (req, res) => {

    (0, _SearchDAL.search)(req.params.keyword).then(result => {
        const searchResult = result.map(product => {
            product.dataValues.imageCover = `${__imageLink}${product.dataValues.imageCover}`;
            return product.dataValues;
        });

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(searchResult));

        return;
    }).catch(err => {
        console.log(err);
    });
});

exports.default = Search;