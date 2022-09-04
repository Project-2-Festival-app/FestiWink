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
  const festivalId  = req.params.id;
  console.log("entro a detail");
  Festival.findById( festivalId )
    .populate("comments")
    .then((festival) => {
      res.render("festival/detail", { festival });
    })
    .catch((err) => {
        next(err);
      });
};
module.exports.doSearch = (req, res, next) => {
  const  {name, category}   = req.body
  console.log("entro a search");
  //{ $or: [ { name:{ '$regex': /name/i}}, {category:{ $regex: new RegExp(category, "i") } }] }
  Festival.find( {category: { $regex: new RegExp(category, "i")} } )
    .then((festivals) => {
      console.log(festivals);
      res.render("festival/list", { festivals });
    })
    .catch((err) => {
      console.log(err);
        next(err);
      });
};

module.exports.comment = (req, res, next) => {
  const  festivalId  = req.params.id;
  const { author, content } = req.body;
  const userId = req.user.id;
  Festival.findById( festivalId )
    .populate("comments")
    .then((festival) => {
      console.log("entro en findById en comment")
      Comment.create({ festival: festivalId, user: userId, author, content })
       .then((commentCreate) => {
        console.log(commentCreate)
        res.redirect (`/festivals/${festival._id}`)
      })
    })
    .catch((err) => {
      console.log(`Error while creating the comment : ${ err }`);
        next(err);
      });
};

module.exports.deleteComment = ( req, res, next ) => {
  const userId = req.user.id;
  const commentId = req.params.id;

  Comment.findOneAndDelete( { id: commentId, user: userId } )
    .populate('festival')
    .then( commentDeleted => {
      return commentDeleted.festival
    })
    .then( (festival) => {
      res.redirect(`/festivals/${festival.id}`)
    })
    .catch (err => {
      console.log(err);
      next(err)
    })
}

module.exports.createFestival = (req, res, next) => {
  res.render("festival/form")
};

module.exports.doCreate = (req, res, next) => {
    const user = req.user
    const festival = {...req.body, creator: user };

    if(req.file) {
        festival.image = req.file.path;
      }
  Festival.create(festival)
    .then((createdFestival) => {
        res.redirect(`/festivals/${createdFestival._id}`)
    })
    .catch(next);
};

module.exports.deleteFestival = (req, res, next ) => {
  const userId = req.user.id.valueOf();
  const festivalId = req.params._id;
  console.log(req.user.id, req.params.id)

  Festival.findOneAndDelete( { id: festivalId, creator: userId })
    .then((festivalDeleted) => {
      console.log("this is the ",festivalDeleted);
      res.redirect("/festivals")
    })
    .catch(err => {
      console.log(err);
      next(err)
    })
}