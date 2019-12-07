var express = require("express");
var router = express.Router();
var router = express.Router({mergeParams: true });
var Campground = require("../models/campground")


//index route
router.get("/",function(req,res){
	   //get all campgrounds from DB
	    Campground.find({},function(err, allCampgrounds){
			if(err){
				console.log(err);
			}else{
				res.render("campgrounds/index",{campgrounds: allCampgrounds});
			}
		});
		
		//res.render("campgrounds",{campgrounds:allcampgrounds});
		});
//CREATE-ROUTE
router.post("/", isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	
	var newCampground = {name: name, image: image,description: desc, author: author }
	//create a new campground and save to db
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err)
		}else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
	
});
//NEW-ROUTE
router.get("/new", isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});
//show route
router.get("/:id",function(req,res){
	//find the campground with provided id and show
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
})
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds")
		} else{
			res.render("campgrounds/edit", {campground: foundCampground} );
		}
		
	});

});
router.post("/:id", function(req,res){
	//find and update the correct campground and redirect show page
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
		
	} )
});
//UPDATE CAMPGROUND ROUTE

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router