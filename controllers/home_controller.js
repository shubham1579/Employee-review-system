const User = require('../models/user');
const Review = require('../models/review');

module.exports.home = async function(req, res){

    try{
        
        // check for authentication
        if (!req.isAuthenticated()) {
            req.flash('error' , 'Please LogIn !');
            return res.redirect('/users/sign-in');
        }

        // getting the data of the employee and the review from the form
        let user = await User.findById(req.user.id);
        let review = await Review.find({ reviewer: req.user.id });

        // creating an empty array for reciever
        let reciever = [];
        for(let i = 0; i<user.userToReview.length ; i++){
            let userName = await User.findById(user.userToReview[i]);
            reciever.push(userName);
        }
        
        // creating an empty array for reviews
        let reviews = [];
        for(let i = 0; i < review.length ; i++){
            let reviewUser = await User.findById(review[i].reviewed);
            if(reviewUser != null){
                let currUser = {
                    name : reviewUser.name,
                    content : review[i].content
                }
                reviews.push(currUser);
            }
        }

        // render the page
        return res.render('home',{
            title : "ERS | HOME",
            reciever : reciever,
            reviews : reviews,
            user : user
        });

    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}