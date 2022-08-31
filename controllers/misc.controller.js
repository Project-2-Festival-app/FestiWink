const Like = require("../models/Like.model");
const Festival = require("../models/Festival.model");
const mongoose = require("mongoose");

module.exports.home = (req, res, next) => {
	res.render("home");
};

module.exports.like = (req, res, next) => {
	const userId = req.user._id.valueOf();
	const festivalId = req.params.id;
  console.log(userId, festivalId);
	// Like.findById({ user: userId, festival: festivalId }).then((like) => {
	// 	if (like) {
	// 		console.log("exists");
	// 	} else {
	// 		return Like.create({
	// 			user: userId,
	// 			festival: festivalId,
	// 		});
	// 	}
	// 	console.log(like);
	// });
};
