const router = require("express").Router();
const passport = require('passport');

const authController = require('../controllers/auth.controller')
const miscController = require('../controllers/misc.controller')
const usersController = require("../controllers/user.controller")
const festController = require("../controllers/fest.controller")
const fileUploader = require('./cloudinary.config')
const authMiddlewares = require("../middlewares/authMiddleware");


const SCOPES = [
    "profile",
    "email"
  ]

//MISC
router.get("/", miscController.home);
router.get("/about",  miscController.about);
router.get("/contactUs", miscController.contact);

// AUTH
router.get("/register", authController.register);
router.post("/register",fileUploader.single('image'), authController.doRegister);

router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);

router.get('/login/google', authMiddlewares.isNotAuthenticated, passport.authenticate('google-auth', { scope: SCOPES  }))
router.get('/auth/google/callback', authMiddlewares.isNotAuthenticated, authController.doLoginGoogle)

router.get("/logout",authMiddlewares.isAuthenticated, authController.logout);
 
router.get('/activate/:token', authController.activateAccount)

// USERS
router.get("/profile", usersController.profile);
router.post("/like/:id",authMiddlewares.isAuthenticated, miscController.like )

// FESTIVALS

router.get("/festivals/create",authMiddlewares.isAuthenticated, festController.createFestival);
router.post("/festivals/create",authMiddlewares.isAuthenticated,fileUploader.single('image'), festController.doCreate);

router.post("/festivals/search", festController.doSearch);

router.get("/festivals", festController.list)


//Festival's detail
router.get("/festivals/:id", festController.detail)
router.post("/festivals/:id/delete", authMiddlewares.isAuthenticated, festController.deleteFestival)

//Comment festival
router.post("/comment/:id", authMiddlewares.isAuthenticated, festController.comment)
router.post("/comment/:id/delete", authMiddlewares.isAuthenticated, festController.deleteComment)

//Edit festival
router.get("/festivals/:id/edit", authMiddlewares.isAuthenticated, festController.editFestival);
router.post("/festivals/:id/edit", authMiddlewares.isAuthenticated, festController.doEdit);



module.exports = router;