const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { saveRedirectTo } = require("../middleware.js");
//signup controller
const userController = require("../controllers/users.js");

//signup routes
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


//login routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectTo, passport.authenticate("local",{
    failureFlash : true,
    failureRedirect : "/login"}), userController.login
);


//logout route
router.get("/logout",userController.logout);

module.exports = router;