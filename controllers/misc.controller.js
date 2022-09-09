const Like = require("../models/Like.model");
const Festival = require("../models/Festival.model");
const mongoose = require("mongoose");

module.exports.home = (req, res, next) => {
	Like.find()
	.populate("festival")
	.then(likes => {
		console.log(likes);
		if(likes){
			Festival.find()
			.then(festivals => {
				res.render("home", { festivals, likes})
			})
		} else {
			Festival.find()
			.then(festivals => {
				console.log("entro en else de like");
				res.render("home", { festivals})
			})
		}
	})
	.catch(err => next(err))
};

module.exports.about = (req, res, next) => {
	res.render('misc/about');
}

module.exports.contact = (req, res, next) => {
	res.render('misc/contact');
}

module.exports.like = (req, res, next) => {
	const userId = req.user._id.valueOf();
	const festivalId = req.params.id;

	Like.findOneAndDelete({ user: userId, festival: festivalId })
	.then((like) => {
		if (like) {
			console.log("exists");
			res.status(204).send({ success: 'Like removed from data base'})
		} else {
			return Like.create({
				user: userId,
				festival: festivalId,
			})
			.then((like) => {
				res.status(200).send({ success: 'Like removed from data base'})
			});
		}
	})
	.catch(err => next(err))	
};
