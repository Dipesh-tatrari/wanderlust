if (process.env.NODE_ENV !== "production"){//this is done to make sure that the dotenv package is only used in development mode and not in production mode
    require("dotenv").config();//this will load the .env file and make the variables available in process.env
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
//we are requiring all the links of listings from the listing.js in the routes folder
const listingrouter = require("./routes/listing.js");
//rewiring all the links from the review.js of the routes
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");


const port = 8080;

app.set("views",path.join(__dirname,"views"));//it tells from where to take the ejs file from
app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const sessionConfig = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {//if cookies don't have these properties then they are called session cookies and they get deleted when the browser is closed
        httpOnly : true,// secure : true, //this is for https
        expires : Date.now() + 1000*60*60*24*3, //this is for three days
        maxAge : 1000*60*60*24*3
    }
};//if there is not http tnen the cookie can be accessed by the client side script which is not good for security and this is called cross site scripting attack
//this is the configuration for the session

app.use(session(sessionConfig));//this is to use the session in our app
app.use(flash());//this is to use the flash in our app

//passport configuration is always important to be written after the session configuration
app.use(passport.initialize());
app.use(passport.session());//passport will use the session to store the user information
passport.use(new LocalStrategy(User.authenticate()));//this is the method that is added by passport local mongoose to the user model

passport.serializeUser(User.serializeUser());//this is to store the user in the session
passport.deserializeUser(User.deserializeUser());//this is to remove the user from the session

//connecting to the mongoose database

main().then(()=>{
    console.log("connected to DB");
})
.catch(err => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wanderLust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


//this is the making of function for the validaion of the listing, it's schema was created in the schema.js with the help of joi to validate sever side data
const validateListing = (req,res,next) =>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//this is the middleware to pass the flash messages to all the ejs files
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;//this will make the current user available in all the ejs filesbecause we can access the req.user provided by passport in all the routes after the user is logged in
    next();
})

app.get("/fakeUser", async(req,res)=>{
    const user = new User({
        email : "fakeuser@example.com",
        username : "fakeuser"
    });     
    const newUser = await User.register(user,"chicken");
    res.send(newUser);
});

app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);

//this is the error handling middleware

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "SOmething went wrong"} = err;
    console.dir(err);
    res.render("listing/error.ejs",{message});
})

app.listen(port,()=>{
    console.log(`app is listening to port ${port}`);
})