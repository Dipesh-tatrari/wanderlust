const Listing = require("../models/listing");
const Review = require("../models/review");

//create review controller
module.exports.createReview = async(req, res) =>{//reviews will be always accessed with the listing id because listing have a one to many relation in this applicstion
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
}

//delete review controller
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});//the pull operator removes form an existing array all instances of a value or values that match a specified condition
    await Review.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the review");

    res.redirect(`/listings/${id}`);
}