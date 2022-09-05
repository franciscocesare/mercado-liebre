const User = require("../models/user");

module.exports = userLoggedMiddleware = (req, res, next) => {
    res.locals.isLogged = false;

    let emailInCookie = req.cookies.userEmail;
    let userFromCookie = User.findByField("email", emailInCookie);

    if (userFromCookie) {
        req.session.user = userFromCookie;
    }
    if (req.session.userLogged) {
        res.locals.isLogged = true;
        res.locals.userLogged = req.session.userLogged;
    }
    next();
};
