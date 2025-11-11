const express = require("express");
const router = express.Router();
//we have to remove the "/listings from the routes as it is the common part which is use din app.js in app.use function and w ehave to require different functions which listing routes from app.js"
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const{ isLoggedIn, isOwner, validateListing} = require("../middleware.js");//requiring middlewares from middleware file



//index route
router.get("/",async (req,res)=>{
     const allListings = await Listing.find({});
     res.render("listing/index.ejs",{allListings});
             
})

//new listing
router.get("/new",isLoggedIn,(req,res)=>{//specific routes are defined earlier as the express understand these routes in the order they are defined
    res.render("listing/new.ejs");
})


//show route
router.get("/:id",wrapAsync(async (req,res)=>{
     let {id} = req.params;
     console.log(id);
     const listing = await Listing.findById(id).populate({path:"reviews",populate : {path: "author"},}).populate("owner");//this is to populate owner as a nested populate in the reviews
    //  console.log(listing);// i have done this to watch am i getting the array of reviews or not
    if(!listing){
        req.flash("error","listing not found");
        return res.redirect("/listings");
    };
     res.render("listing/show.ejs",{listing});
 }))

//post  request for create
router.post("/",validateListing,wrapAsync(async (req,res)=>{//we are using validateListing as an middleware to validate the schema of the data entered
        // let{title,description,image,price,loacation,country} = req.body; there is a much better way of doing that by creating a listing object in the ejs page 
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;//we are setting the owner of the listing to the currently logged in user
        await newListing.save();
        req.flash("success","Successfully created a new listing");
        res.redirect("/listings");    
}))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found");
        return res.redirect("/listings");
    };
    res.render("listing/edit.ejs",{listing});
}))

//update route
router.put("/:id",isLoggedIn, isOwner,validateListing,wrapAsync(async (req,res)=>{//we are using validateListing as an middleware to validate the schema of the data entered
    // if(!req.body.listing) {
    //     throw new ExpressError(400,"send valid data for listing")//we are skipping these lines because we are validating the schema throught the validateSchema middleware
    // }
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Successfully updated the listing");
    res.redirect(`/listings/${id}`);
}))

//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);//whenever this findbyIdanddelete is called the middleware that we have created in the listing.js will be called automatically
    console.log(deletedListing);//the middleware created in the listing.js is a post middleware, it will delete all the reviews of the listing ehich is deleted
    req.flash("success","Successfully deleted the listing");
    res.redirect("/listings");
}));

module.exports = router;