const Listing = require("../models/listing");
const {geocode} = require("../public/js/map.js");
const ExpressError = require("../utils/ExpressError");


//index route
module.exports.index = async (req,res)=>{
     const allListings = await Listing.find({});
     res.render("listing/index.ejs",{allListings});
             
}

//new listing
module.exports.renderNewForm = (req,res)=>{//specific routes are defined earlier as the express understand these routes in the order they are defined
    res.render("listing/new.ejs");
}

//show route
module.exports.showListing = async (req,res)=>{
     let {id} = req.params;
     console.log(id);
     const listing = await Listing.findById(id).populate({path:"reviews",populate : {path: "author"},}).populate("owner");//this is to populate owner as a nested populate in the reviews
     console.log(listing);
    //  console.log(listing);// i have done this to watch am i getting the array of reviews or not
    if(!listing){
        req.flash("error","listing not found");
        return res.redirect("/listings");
    };
     res.render("listing/show.ejs",{listing});
}

//post  request for create
module.exports.createListing = async (req,res,next)=>{//we are using validateListing as an middleware to validate the schema of the data entered
        // let{title,description,image,price,loacation,country} = req.body; there is a much better way of doing that by creating a listing object in the ejs page 
        let url = req.file.path;
        let filename = req.file.filename;
        let location = req.body.listing.location;
        let geoData = await geocode(location);
        req.body.listing.geometry = {
            lat: parseFloat(geoData[0].lat),
            lng: parseFloat(geoData[0].lon)
        };
        console.log(req.body.listing);
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;//we are setting the owner of the listing to the currently logged in user
        newListing.image = {url, filename};//we are setting the image property of the listing to an object containing url and filename
        console.log(newListing);
        await newListing.save();
        req.flash("success","Successfully created a new listing");
        res.redirect("/listings");    
}

//edit route
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found");
        return res.redirect("/listings");
    };
    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace('/upload','/upload/h_300,w_300');//this is to resize the image while editing the listing
    res.render("listing/edit.ejs",{listing, originalImageURL});
}

//update route
module.exports.updateListing = async (req,res)=>{//we are using validateListing as an middleware to validate the schema of the data entered
    // if(!req.body.listing) {
    //     throw new ExpressError(400,"send valid data for listing")//we are skipping these lines because we are validating the schema throught the validateSchema middleware
    // }
    let {id}= req.params;
    // build update payload but don't overwrite image unless a new file is uploaded
    const updateData = { ...req.body.listing };
    if (!req.file && Object.prototype.hasOwnProperty.call(updateData, 'image')) {
        // if the form sent an empty image field, remove it so we don't overwrite the existing object
        delete updateData.image;
    }
    // request the updated document back from findByIdAndUpdate
    let listing = await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    console.log('uploaded file:', req.file);

    // if a new file was uploaded, use req.file.path and req.file.filename
    if (req.file) { // if no file was uploaded, req.file will be undefined
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        console.log('setting image:', listing.image);
        await listing.save();
    }
    req.flash("success","Successfully updated the listing");
    res.redirect(`/listings/${id}`);
}

//Delete route
module.exports.destroyListing = async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);//whenever this findbyIdanddelete is called the middleware that we have created in the listing.js will be called automatically
    console.log(deletedListing);//the middleware created in the listing.js is a post middleware, it will delete all the reviews of the listing ehich is deleted
    req.flash("success","Successfully deleted the listing");
    res.redirect("/listings");
}