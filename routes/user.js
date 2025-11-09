const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { saveRedirectTo } = require("../middleware.js");

//user signup route
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const user = new User({username, email});//we are creating a new user with the username and email only because the password will be hashed and salted by the passport local mongoose
        const newUser = await User.register(user,password);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
        req.flash("success","Welcome to WanderLust!");
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/users/signup");
    }
}));

//login routes
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectTo, passport.authenticate("local",{
    failureFlash : true,
    failureRedirect : "/login"}), async(req,res)=>{
        req.flash("success","Welcome back!");
        res.redirect(res.locals.redirectTo  || "/listings");//if there is no redirectTo in the locals then redirect to the listings page
    }
);

//logout route
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    });
});

module.exports = router;