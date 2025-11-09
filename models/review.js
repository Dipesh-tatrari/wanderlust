const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating :{
        type : Number,
        min: 1,
        max: 5,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    }
});

//we are exporting this model because we donot need to create an extra step in the main app to connect to the database through the model
module.exports = mongoose.model("Review", reviewSchema);