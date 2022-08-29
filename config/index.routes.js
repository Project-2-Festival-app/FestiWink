const router = require("express").Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller')
const miscController = require('../controllers/misc.controller')
const usersController = require("../controllers/user.controller")
const fileUploader = require('./cloudinary.config')

const SCOPES = [
    "profile",
    "email"
  ]

//MISC
router.get("/", miscController.home)

// AUTH
router.get("/register", authController.register);
router.post("/register",fileUploader.single('image'), authController.doRegister);

router.get("/login", authController.login);
router.post("/login", authController.doLogin);
router.get("/logout", authController.logout);

router.get('/login/google', passport.authenticate('google-auth', { scope: SCOPES  }))
router.get('/auth/google/callback', authController.doLoginGoogle)
router.get('/activate/:token', authController.activateAccount)
// USERS
router.get("/profile", usersController.profile);

module.exports = router;