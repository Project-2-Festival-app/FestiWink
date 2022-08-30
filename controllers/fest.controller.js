const Festival = require("../models/Festival.model");
const mongoose = require("mongoose");

module.exports.list = (req, res, next) => {
  Festival.find()
    .then((festivals) => {
      res.render("festival/list", { festivals });
    })
    .catch((err) => next(err));
};

module.exports.detail = (req, res, next) => {
  const { id } = req.params;
  Festival.findById( id )
    .then((festival) => {
      res.render("festival/detail", { festival });
    })
    .catch((err) => {
        console.error(err);
        next(createError(404, "Festival not found"));
      });
};
