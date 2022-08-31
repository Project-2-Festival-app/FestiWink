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

        next(err);
      });
};

module.exports.createFestival = (req, res, next) => {
    console.log("createFestival entro");
res.render("festival/form")
};

module.exports.doCreate = (req, res, next) => {
    const festival = req.body;
    if(req.file) {
        festival.image = req.file.path;
      }
    console.log("doCreate entro festivals");
  Festival.create(festival)
    .then((createdFestival) => {
        res.redirect(`/festivals/${createdFestival._id}`)
    })
    .catch(next);
};
