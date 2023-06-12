const User = require("../models/user")
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const signup = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email already in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}

module.exports = {
	signup: ctrlWrapper(signup),
	
}