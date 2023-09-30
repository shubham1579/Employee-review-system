const User = require('../models/user');

// redering the Sign In page
module.exports.signIn = function(req, res){
    return res.render('sign_in', {
        title : 'ERS | Sign-In'
    });
}

// session creation
module.exports.createSession = async function(req, res){
    req.flash('success', 'You are logged In');
    return res.redirect('/');
}

// rendering the Sign Up page
module.exports.signUp = function(req, res){
    return res.render('sign_up', {
        title : 'ERS | SignUp'
    });
}

// Logic to create a new user
module.exports.create = async function(req, res){
    if(req.body.password != req.body.confirmPassword){
        req.flash('error' , 'Password should be equal to Confirm Password');
        return res.redirect('back');
    }

    let user = await User.findOne({email : req.body.email});
    if(!user){
        await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            isAdmin : false
        });
        
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');
}

// For logging out
module.exports.destroySession = function (req, res, done){
    return req.logout((err) =>{
        if(err){
            return done(err);
        }
        req.flash('success' , 'Logged Out Sucessfully !');
        return res.redirect('/users/sign-in');
    });
    
}

module.exports.forgetPasswordPage = function(req, res){
    return res.render('forgotPassword',{
        title : 'Forget Password'
    });
}

// Updation of password
module.exports.forgetPasswordLink = async function(req, res){
    let user = await User.findOne({ email: req.body.email });
    if(!user){
        return res.redirect('/users/signUp');
    }
    if(req.body.password == req.body.confirmPassword){
        req.flash('success' , 'Password Changed :)');
        user.password = req.body.password;
        await user.updateOne({password : req.body.password});
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');

}

// Logic to add a new employee
module.exports.addEmployeee = async function(req, res){
    if(req.body.password != req.body.confirmPassword){
        req.flash('error' , 'Password should be equal to Confirm Password');
        return res.redirect('back');
    }
    let user = await User.findOne({email : req.body.email});
    if(!user){
        await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            isAdmin : false
        });
        
        return res.redirect('/admin/view-employee');
    }
    return res.redirect('back');
}

// Making an employee a new admin
module.exports.makeAdmin = async function(req, res){
    try {
        if (req.body.admin_password == 'happy') {
            let user = await User.findById(req.user.id );
            user.isAdmin = true;
            user.save();
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
        
    }
    catch (error) {
        console.log('Error', error);
        return;
    }
}
