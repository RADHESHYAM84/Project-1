const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
// const ExpressError=require("../utils/ExpressError.js")
// const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer= require('multer');
const{storage}=require("../cloudConfig.js")
const upload=multer({storage});



router
    .route("/")
    .get( wrapAsync(listingControllers.index))    //index route
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.createListing));    //Create Route

    // .post(upload.single("listing[image]"),(req,res)=>{
    // res.send(req.file);
// });

// New route  
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingControllers.showListing))   //Show Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.updateListing))   //Update Route
    .delete(isLoggedIn,isOwner, wrapAsync(listingControllers.destroyListing));  //Delete Route


//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(listingControllers.renderEditForm));

module.exports= router;
   