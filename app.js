if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}
const express= require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-Mate");
// const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session= require("express-session");
const MongoStore=require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");



// const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
      .then(()=>{
        console.log("connected to DB");
      })

.catch((err) => {
    console.log(err);
})

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
         expires:Date.now()+7*24*60*60*1000,
         maxAge: 7*24*60*60*1000,
         httpOnly:true,
  },
}

// app.get("/",(req,res) =>{
//   res.send("Hi,I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
 res.locals.success=req.flash("success");
 res.locals.error=req.flash("error");
res.locals.currUser=req.user;//ye hum eslie define karte h kyoki hum jo passport ka function h //
                              //req.user jiske ander login user ki details hoti h use hum use karna //
                              //chahte h apne views/includes/navbar.ejs ke andar agar aisa nahi karege tab//
                              // req.user vha kaam nahi karega ab currUser ko vha use kar sakte h//
 next();
});


// app.get("/demouser",async(req,res)=>{
//   let fakeUser1=new User({
//     email:"studen1@gmail.com",
//     username:"delta-student1",
//   });
// let registeredUser= await User.register(fakeUser1,"helloworld1");
// res.send(registeredUser);
// });




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);






// app.get("/testingListing", async(req,res) => {
//      let SampleListing= new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1300,
//         location:"calangute, goa",
//         country:"india",
//      })
//      await SampleListing.save();
//      console.log("sample was saved");
//      res.send("successful testing");
// })

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"));
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong!"}=err;
  res.status(statusCode).render("listings/error.ejs",{err});
  // res.status(statusCode).send(message);
});

app.listen(8080,() =>{
    console.log("Server is listening at port 8080");
})