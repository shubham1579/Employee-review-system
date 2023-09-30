const Users = require('../models/user');

// Logic for assigning the work to the employees
module.exports.assignWork = async function(req, res){
    let employee = await Users.find({});

    return res.render('admin',  {
        title : 'ERS | Assign Work',
        employee : employee
    });
}

// Logic to show the list of the employees
module.exports.showEmployeeList = async function(req, res){
    if(!req.isAuthenticated()){
        req.flash('error' , 'You are not Authorized !');
        return res.redirect('/users/sign-in');
    }
    if(req.user.isAdmin == false){
        req.flash('error' , 'You are not Authorized');
        return res.redirect('/');
    }
    let employeeList = await Users.find({});

    return res.render('employee', {
        title : "ERS | Employe-List",
        employees : employeeList
    });
}

// Logic to set the review and reviewer
module.exports.setReviewAndReviewer = async function(req, res){
    try{
        
        if(!req.isAuthenticated()){

            req.flash('success' , 'Please Login !');
            return res.redirect('/users/sign-in');

        }
        else{

            let employee = await Users.findById(req.user.id);
    
            if(employee.isAdmin == false){
                
                req.flash('error' , 'Opps ! Not Authorized ');
                return res.redirect('/users/sign-in');

            }
        
            else if(req.body.sender == req.body.reciver){
        
                req.flash('error' , 'Sender and reciver should not be same !');
                return res.redirect('back');

            }
            
            else{

                let sender = await Users.findById(req.body.sender);
                let reciver = await Users.findById(req.body.reciver);
                
                sender.userToReview.push(reciver);
                sender.save();
                reciver.reviewRecivedFrom.push(sender);
                reciver.save();
                
                req.flash('success', 'Task Assigned !');
                return res.redirect('back');
            }
        }
       
    }
    catch(err){
        console.log("Errror in setting up the user " + err);
    }

}

// Logic to make a new admin
module.exports.newAdmin = async function(req, res){
    try{
        
        if(!req.isAuthenticated()){
            
            req.flash("success" , 'Please LogIn !');
            return res.redirect('/users/sign-in');

        }
        
        if(req.user.isAdmin == false){

            req.flash('error' , 'You are not Admin !');
            return res.redirect('/');

        }
        
        if(req.user.isAdmin){
            let user = await Users.findById(req.body.selectedUser);
            if(!user){
                
                return res.redirect('back');

            }
            req.flash('success' , 'New Admin Added');
            user.isAdmin = "true";
            user.save();
            return res.redirect('back');
        }
        
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

// Logic to delete the employee
module.exports.deleteEmployee = async function(req, res){
    try{
        
        if(!req.isAuthenticated()){
            
            req.flash('error' , 'Please Login!')
            return res.redirect('users/sign-in');

        }

        if(!req.user.isAdmin){
            
            req.flash('error' , 'You are not an admin!')
            return res.redirect('/');

        }
        
        let employee = await Users.deleteOne({_id : req.params.id});
        
        req.flash('success' , 'User Deleted Successfully')
        return res.redirect('back');


    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

// Logic to add the employee
module.exports.addEmployee = function(req, res){
    return res.render('addEmployee', {
        title : 'Add Employee'
    });
}