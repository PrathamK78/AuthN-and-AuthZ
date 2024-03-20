const jwt = require('jsonwebtoken');
require('dotenv').config();

//when one middleware has finished its work, it can call the next middleware in the chain by calling next()
exports.auth = (req, res, next) => {
    try{
        //extract jwt token
        const token = req.body.token;

        if(!token){
            return res.status(401).json({message: 'Token not found'});
        }
        //verify token
        //verify method se kya hoga ki agar token valid hoga toh payload me user ki details aajayengi
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            //isse kya hoga ki jo bhi route pe ye middleware use hoga usme req.user me user ki details aajayengi
            req.user = payload;

            }catch(error){
            return res.status(401).json({message: 'Invalid token'});
        }
        next();
    }
    catch(error){
        console.error(error);
        res.status(400).json({message: 'Something went wrong while verifying token'});
    }
};

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== 'Student'){
            return res.status(403).json({message: 'You are not authorized to access this route'});
        }
        next();
    }
    catch(error){
        return res.status(500).json({message: 'Something went wrong while checking user role'});
    }
};

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== 'Admin'){
            return res.status(403).json({message: 'You are not authorized to access this route'});
        }
        next();
    }
    catch(error){
        return res.status(500).json({message: 'Something went wrong while checking user role'});
    }
};