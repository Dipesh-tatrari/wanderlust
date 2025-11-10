const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


//this middleware will check if the user is logged in or not
module.exports.isLoggedIn = (req,res,next) =>{
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){//this method is provided by passport to check if the user is authenticated or not
        req.session.redirectTo = req.originalUrl;//this will store the url that the user is requesting to access
        req.flash("error","You must be signed in first!, to create listing");
        return res.redirect("/login");
    }
    next();
}

//this middleware will save the redirectTo url in the res.locals so that we can access it in the login route after successful login
module.exports.saveRedirectTo = (req,res,next) =>{
    if(req.session.redirectTo){
        res.locals.redirectTo = req.session.redirectTo;
    }
    next();
}

//this middleware will check if the user is the owner of the listing or not
module.exports.isOwner = async(req,res,next) =>{
    let {id}= req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(currentUser._id)){//we are checking if the owner of the listing is the same as the currently logged in user
            req.flash("error","You do not have permission to do that");
            return res.redirect(`/listings/${id}`);
        }
        next();//if we don't call next here the request will be left hanging i.e. it will get stuck here
}

//this is the making of function for the validaion of the listing, it's schema was created in the schema.js with the help of joi to validate sever side data
//this is also the server side validation of the listing function and is necessary for storing the correcct information in the database
module.exports.validateListing = (req,res,next) =>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//this is the server side validation of the revies function and is necessary for storing the correcct information in the database
module.exports.validatereview = (req,res,next) =>{
    let result = reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}