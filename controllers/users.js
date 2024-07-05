const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>{
    try{
        let{username,email,password}=req.body;
const newUser=new User({username,email});
const registeredUser= await User.register(newUser,password);
console.log(registeredUser);
req.login(registeredUser,(err)=>{  //re.login() function eslie h taaki signup karke automatic login ho jaaye//
    if(err){
        return next(err);
    }
req.flash("success","welcome to wanderlust!");
res.redirect("/listings");
});

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}


module.exports.Login=async(req,res)=>{
    req.flash("success","welcome back to wandwerlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    }


module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You successfully logout!");
        res.redirect("/listings");
    })}