const express = require("express");
const router = express.Router({mergeParams: true});//this merge params will merge the parameters of child and parent routes
//we have to remove the "/listings from the routes as it is the common part which is use din app.js in app.use function and w ehave to require different functions which listing routes from app.js"
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const{validatereview, isLoggedIn} = require("../middleware.js");




//Reviews
//Post review route
router.post("/",isLoggedIn, validatereview,wrapAsync(async(req, res) =>{//reviews will be always accessed with the listing id because listing have a one to many relation in this applicstion
    let {id} = req.params;
    let listing = await Listing.findById(id);//first we will find the listing with the id given
    let newReview = new Review(req.body.review);//we are passing the whole review object in the new newReview created
    newReview.author = req.user._id;//we are setting the author of the review to the currently logged in user
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Successfully created a new review");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}))

//delete review route
router.delete("/:reviewId",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});//the pull operator removes form an existing array all instances of a value or values that match a specified condition
    await Review.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the review");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;