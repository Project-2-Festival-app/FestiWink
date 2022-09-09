const User = require("../models/User.model");
const mongoose = require("mongoose");
const passport = require('passport');
const mailer = require("../config/mailer.config");


module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = req.body;
  if(req.file) {
    user.image = req.file.path
  }

  const renderWithErrors = (errors) => {
    res.render("auth/register", { errors, user });
  };

  User.findOne({ $or:[{ email: user.email }, { name: user.name }] })
    .then((userFound) => {
      if (userFound) {
        renderWithErrors("Email already exist");
      } else {
        return User.create(user).then((userCreated) => {
          console.log(
            'entro en mailer con', userCreated
          )
          mailer.sendActivationMail(userCreated.email, userCreated.activationToken);
          res.redirect("/login");
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors)
      } else {
        console.log("err", err)
        next(err)
      }
    });
  };
  
  module.exports.login = (req, res, next) => {
    res.render("auth/login");
  };

const login = (req, res, next, provider) => {
  passport.authenticate(provider || 'local-auth', (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errors: validations.error })
    } else {
      req.login(user, (loginError) => {
        console.log("user en login", user)
        if (loginError) {
          next(loginError)
        } else {
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
}


module.exports.doLogin = (req, res, next) => {
  login(req, res, next);
};

module.exports.doLoginGoogle = (req, res, next) => {
  login(req, res, next, 'google-auth')
};

module.exports.logout = (req, res, next) => {
  req.logout(() => res.redirect('/login'))
};


module.exports.activateAccount = (req, res, next) => {
  const token = req.params.token;

  User.findOneAndUpdate(
    { activationToken: token, active: false },
    { active: true }
  )
    .then((user) => {
      if (user) {
        res.render("auth/login", {
         user ,
          message: "You have activated your account. Thanks for joining!"
        })
      } else {
        res.redirect("/login")
      }
    })
    .catch(next)
}