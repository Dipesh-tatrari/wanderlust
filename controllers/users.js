const User = require("../models/user.js");

//render signup form
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};


//user signup controller
module.exports.signup = async(req,res)=>{
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
};

//render login form
module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
};

//login controller is already handled in the route file using passport.authenticate middleware but for simplicity we are naming the below route as login controller
module.exports.login = async(req,res)=>{
        req.flash("success","Welcome back!");
        res.redirect(res.locals.redirectTo  || "/listings");//if there is no redirectTo in the locals then redirect to the listings page
};

//logout controller
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    });
}