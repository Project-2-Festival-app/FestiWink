const Festival = require("../models/Festival.model");
const mongoose = require("mongoose");

module.exports.list = (req,res,next) => {
    console.log("entro en list");
 Festival.find()
 .then((festivals) => {
     res.render("festival/list", {festivals})
 })
 .catch(err => next(err))
}

