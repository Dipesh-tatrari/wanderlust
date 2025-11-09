module.exports.isLoggedIn = (req,res,next) =>{
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){//this method is provided by passport to check if the user is authenticated or not
        req.session.redirectTo = req.originalUrl;//this will store the url that the user is requesting to access
        req.flash("error","You must be signed in first!, to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectTo = (req,res,next) =>{
    if(req.session.redirectTo){
        res.locals.redirectTo = req.session.redirectTo;
    }
    next();
}