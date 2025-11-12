const express = require("express");
const router = express.Router({mergeParams: true});//this merge params will merge the parameters of child and parent routes
//we have to remove the "/listings from the routes as it is the common part which is use din app.js in app.use function and w ehave to require different functions which listing routes from app.js"
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const{validatereview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//create review controller
const reviewController = require("../controllers/reviews.js");


//Reviews
//Post review route
router.post("/",isLoggedIn, validatereview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;