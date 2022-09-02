const Festival = require("../models/Festival.model");

const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

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
    .populate("comments")
    .then((festival) => {
      res.render("festival/detail", { festival });
    })
    .catch((err) => {
        next(err);
      });
};

module.exports.comment = (req, res, next) => {
  const  festivalId  = req.params.id;
  const { author, content } = req.body;
  const userId = req.user.id.valueOf()
  Festival.findById( festivalId )
    .then((festival) => {
      console.log("entro en findById en comment")
      Comment.create({ festival: festivalId, user: userId, author, content })
        .then(comment => {
          console.log("comentario creado then ")
          festival.comments.push(comment._id)
          festival.save()
            .then(updatedFesti => res.redirect (`/festivals/${updatedFesti._id}`))
        })
    })
    .catch((err) => {
      console.log(`Error while creating the comment : ${ err }`);
        next(err);
      });
};

module.exports.createFestival = (req, res, next) => {
  res.render("festival/form")
};

module.exports.doCreate = (req, res, next) => {
    const festival = req.body;
    if(req.file) {
        festival.image = req.file.path;
      }
  Festival.create(festival)
    .then((createdFestival) => {
        res.redirect(`/festivals/${createdFestival._id}`)
    })
    .catch(next);
};
