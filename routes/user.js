const express = require('express');
const router = express.Router();


const {login,signup} = require('../Controllers/Auth');
const {auth,isStudent,isAdmin} = require('../middlewares/auth');

router.post('/login', login);
router.post('/signup', signup);

//Protected routes
//yaha batana padega ki is path me konse middlewares use honge
router.get('/student',auth,isStudent, (req,res) => {
    res.status(200).json({message: 'Welcome Student'});
});

router.get('/admin',auth,isAdmin, (req,res) => {
    res.status(200).json({message: 'Welcome Admin'});
});

module.exports = router;