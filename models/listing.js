const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        type :String,
        default : "https://unsplash.com/photos/wooden-path-winds-through-a-misty-forest-at-sunset-UpNwL3hTcRg",//this default will always be applied if there is no image given
        set :(v)=> v===" "?"https://unsplash.com/photos/wooden-path-winds-through-a-misty-forest-at-sunset-UpNwL3hTcRg":v// and this value will be applied if there is imaghe string but it is empty
    },
    price : String,
    location : String,
    country : String,
    reviews :[ {
        type : Schema.Types.ObjectId,
        ref : "Review",
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
        await Review.deleteMany({ _id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;