const express = require("express");
const router = express.Router();
//we have to remove the "/listings from the routes as it is the common part which is use din app.js in app.use function and w ehave to require different functions which listing routes from app.js"
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const{ isLoggedIn, isOwner, validateListing} = require("../middleware.js");//requiring middlewares from middleware file
const listingController = require("../controllers/listings.js");

const multer = require("multer");//we require multer for file uploading
const {storage} = require("../cloudConfig.js");//we are requiring the storage from cloudConfig.js
const upload = multer({storage});//this is the multer configuration to use cloudinary as the storage engine


router.route("/")
    //index route
    .get(wrapAsync(listingController.index))
    //post  request for create
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));



//new listing
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    //show route
    .get(wrapAsync(listingController.showListing))
    //update route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))//we are using validateListing as an middleware to validate the schema of the data entered
    //delete route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router;