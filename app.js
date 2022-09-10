require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const createError = require("http-errors")
const path = require ('path');
const passport = require('passport');
const hbs = require("hbs");

require("./config/db.config");
require('./config/passport.config');

const app = express();

//Middlewares
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));

//Config Session
const sessionConfig = require("./config/session.config");
app.use(sessionConfig);

//Hbs config
app.set("views",path.join( __dirname + "/views"));
app.set("view engine", "hbs");

hbs.registerPartials(path.join(__dirname + "/views/partials"));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes config
app.use((req, res, next) => {
  res.locals.currentUser =  req.user;
  next();
});

const router = require("./config/index.routes");
app.use(router);

//Error handling
app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});
app.use((error, req, res, next) => {
  console.log(error)
  let status =  error.status || 500;
  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {}
  })
})

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));