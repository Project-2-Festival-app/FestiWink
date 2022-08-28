const router = require("express").Router();
const passport = require("passport");

const authController = require('../controllers/auth.controller')
const miscController = require('../controllers/misc.controller')
const usersController = require("../controllers/user.controller")

//MISC
router.get("/", miscController.home)

// AUTH
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

router.get("/login", authController.login);
router.post("/login", authController.doLogin);
//router.get("/logout", authController.logout);

// USERS
router.get("/profile", usersController.profile);

module.exports = router;