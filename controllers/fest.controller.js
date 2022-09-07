const Festival = require("../models/Festival.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Like = require("../models/Like.model");
const { like } = require("./misc.controller");

module.exports.list = (req, res, next) => {
	Festival.find()
		.then((festivals) => {
			res.render("festival/list", { festivals });
		})
		.catch((err) => next(err));
};

module.exports.detail = (req, res, next) => {
	const festivalId = req.params.id;

	let isLike = false;

	if (req.user) {
		const userId = req.user._id.toString();
		Like.findOne({ user: userId, festival: festivalId })
			.populate({
				path: "festival",
				populate: {
					path: "comments",
				},
			})
			.then((like) => {
				if (like) {
					console.log(like);
					isLike = true;
					return like.festival;
				} else {
					return Festival.findById(festivalId)
						.populate("comments")
						.then((festival) => {
							return festival;
						});
				}
			})
			.then((festival) => {
				console.log(festival);
				if (festival.creator) {
					const sameUser =
						festival.creator._id.valueOf() === userId ? true : false;
					res.render("festival/detail", { festival, sameUser, isLike: isLike });
				} else {
					res.render("festival/detail", { festival, isLike });
				}
			})
			.catch((err) => {
				console.log(err);
				next(err);
			});
	} else {
		Festival.findById(festivalId)
			.populate("comments")
			.then((festival) => {
					res.render("festival/detail", { festival, isLike });
			})
			.catch((err) => {
				console.log(err);
				next(err);
			});
	}
};
module.exports.doSearch = (req, res, next) => {
	const { name, category } = req.body;
	console.log("entro a search");
	//{ $or: [ { name:{ '$regex': /name/i}}, {category:{ $regex: new RegExp(category, "i") } }] }
	Festival.find({ category: { $regex: new RegExp(category, "i") } })
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
	const festivalId = req.params.id;
	const { author, content } = req.body;
	const userId = req.user.id;
	Festival.findById(festivalId)
		.populate("comments")
		.then((festival) => {
			console.log("entro en findById en comment");
			Comment.create({
				festival: festivalId,
				user: userId,
				author,
				content,
			}).then((commentCreate) => {
				console.log(commentCreate);
				res.redirect(`/festivals/${festival._id}`);
			});
		})
		.catch((err) => {
			console.log(`Error while creating the comment : ${err}`);
			next(err);
		});
};

module.exports.deleteComment = (req, res, next) => {
	const userId = req.user.id;
	const commentId = req.params.id;

	Comment.findOneAndDelete({ id: commentId, user: userId })
		.populate("festival")
		.then((commentDeleted) => {
			return commentDeleted.festival;
		})
		.then((festival) => {
			res.redirect(`/festivals/${festival.id}`);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
};

module.exports.createFestival = (req, res, next) => {
	res.render("festival/form");
};

module.exports.doCreate = (req, res, next) => {
	const user = req.user;
	const festival = { ...req.body, creator: user };

	if (req.file) {
		festival.image = req.file.path;
	}
	Festival.create(festival)
		.then((createdFestival) => {
			res.redirect(`/festivals/${createdFestival._id}`);
		})
		.catch(next);
};

module.exports.editFestival = (req, res, next) => {
	const { id } = req.params;
	Festival.findByIdAndUpdate(id)
		.then((festival) => {
			res.render("festival/form", { festival, isEdit: true });
		})
		.catch((err) => next(err));
};
module.exports.doEdit = (req, res, next) => {
	const { id } = req.params;
	Festival.findByIdAndUpdate(id, req.body, { new: true })
		.then((festival) => {
			res.redirect("/festivals");
		})
		.catch((err) => next(err));
};

module.exports.deleteFestival = (req, res, next) => {
	const userId = req.user.id.valueOf();
	const festivalId = req.params._id;
	console.log(req.user.id, req.params.id);

	Festival.findOneAndDelete({ id: festivalId, creator: userId })
		.then((festivalDeleted) => {
			console.log("this is the ", festivalDeleted);
			res.redirect("/festivals");
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
};
