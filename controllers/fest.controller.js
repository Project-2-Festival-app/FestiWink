const Festival = require("../models/Festival.model");
const mongoose = require("mongoose");

module.exports.list =(req,res,next) => {
 Festival.find()
 .then((festivals) => {
     res.render("festival/list",{festivals})
 })
}

