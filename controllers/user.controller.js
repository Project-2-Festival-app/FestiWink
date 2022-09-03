const Festival = require("../models/Festival.model");
const { populate } = require("../models/Like.model");
const Like = require("../models/Like.model")


module.exports.profile = (req, res, next) => {
  const userId = req.user._id.valueOf();

  Like.find({ user: userId })
  .populate("festival")
  .then((likes) => {
    res.render("users/profile", { likes });
  })
  .catch( err => next( err ))
};
