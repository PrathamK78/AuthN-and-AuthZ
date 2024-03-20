const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
    try{
        const {name, email, password, role} = req.body;
        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10); 
        }
        catch(error){
            return res.status(500).json({message: 'Error hashing password'});
        }

        //create new user (User model)
        const user = await User.create({
            name, email, password:hashedPassword, role
        })

        res.status(200).json({message: 'User created successfully'});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Error creating user, Please try again later'});
    }
};

//login controller
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        //check if user exists
        if(!email || !password){
            return res.status(400).json({message: 'Please provide email and password'});
        }
        //check if user exists
        let user = await User.findOne({email});
        //if user does not exist
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        //create payload
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }
        //check if password is correct and generate jwt token
        if(await bcrypt.compare(password, user.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '1h'});

            // user = user.toObject(); 
            //FIXME: why is this line here?
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 24*60*60*1000),
                httpOnly: true
            }
            //res.cookie('cookieName', 'cookieValue', {httpOnly: true});
            //httpsOnly is used to ensure that cookie is only sent over server not client side
            res.cookie('token', token, options).status(200).json({message: 'User logged in successfully', user, token});
        }
        else{
            return res.status(401).json({message: 'Incorrect password'});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Error logging in, Please try again later'});
    }
};


