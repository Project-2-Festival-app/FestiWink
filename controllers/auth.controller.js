const mongoose = require("mongoose");
const passport = require("passport");
const mailer = require("../config/mailer.config");

module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = req.body;
  if(req.file) {
    user.image = req.file.path 
  };
  const renderWithErrors = (errors) => {
    res.render("auth/register", { errors, user });
  };

  User.findOne({ email: user.email }) 
    .then((userFound) => {
      if (userFound) { 
        renderWithErrors("Email already exist");
      } else { 
        return User.create(user).then((userCreated) => {
          //mailer.sendActivationMail(userCreated.email, userCreated.activationToken);
          res.redirect("/profile");
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};

const login = (req, res, next, provider) => {
  passport.authenticate(provider || "local-auth", (err, user, validations) => { 
    if (err) { // si hay error 
      next(err); // mandamos mensaje de error
    } else if (!user) { // si el user no existe mandamos error de validacion en credenciales
      res.status(404).render("auth/login", { errors: validations.error });
    } else {
      req.login(user, (loginError) => { // si hay user
        if (loginError) { // si hay error al hacer el login
          next(loginError); // mensaje de error en el login
        } else {
          res.redirect("/profile"); // si no hay error lo dejamos entrar a su perfil
        }
      });
    }
  })(req, res, next);
};

module.exports.doLogin = (req, res, next) => {
  login(req, res, next);
};

module.exports.doLoginGoogle = (req, res, next) => {
  login(req, res, next, "google-auth");
};

module.exports.logout = (req, res, next) => { 
  req.logout(() => res.redirect("/login")); 
};

module.exports.activateAccount = (req, res, next) => {
    const token = req.params.token;
  
    User.findOneAndUpdate(
      { activationToken: token, status: false }, 
      { status: true } 
    )
      .then((user) => {
        if (user) { 
          res.render("auth/login", { 
            user: { email: user.email }, 
            message: "You have activated your account. Thanks for joining our team!" 
          })
        } else {
          res.redirect("/login") 
        }
      })
      .catch(next)
  }