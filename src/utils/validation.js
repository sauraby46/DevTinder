
const validator = require('validator'); 

const validateSignUpData = (req) =>{

    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    }else if(!validator.isEmail(email)){
        throw new Error("Invalid email address");
    }else if ( !validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
};

const validateEditProfileData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field)); 
    return isEditAllowed;
};


module.exports = {
    validateSignUpData,
    validateEditProfileData
};