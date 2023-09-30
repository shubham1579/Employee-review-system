const User = require('../models/user')
const Review = require('../models/review')

// Logic to create a new review
module.exports.newReview = async (req, res) => {

    try {
        let recipient = await User.findById(req.params.id);

        if (!recipient) {
            console.log("Recipient is not valid");
            return res.redirect('/');
        }

        for(let i = 0; i<req.user.userToReview.length ; i++){
            if (req.user.userToReview[i] == recipient.id) {
                let deleted = req.user.userToReview.splice(i, 1);
                req.user.save();
            }
        }

        for (let i = 0; i < recipient.reviewRecivedFrom.length; i++){
            if (req.user) {
                if (recipient.reviewRecivedFrom[i] == req.user.id) {
                    req.user.userToReview.pop(i);
                    const new_review = Review.create({
                       reviewer : recipient.id,
                        reviewed: req.user.id,
                        content: req.query.newReview,
                    });

                    if (!new_review) {
                        console.log("Review is not created");
                    }

                    return res.redirect('/');
                }
            }
            else {
                console.log("user is not loggin");
                req.flash('error' , "Please LogiN yourself !");
                return res.redirect("/users/sign-in");
            }
        }
        return res.redirect('/');
    }
    catch (err) {
        console.log('error', err);
        return;
   }
}