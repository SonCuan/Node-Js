const User = require('../models/UserModels.js');  
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redirect = require('express/lib/response');
exports.register = async (req , res ) => { 
    try {
        const data = {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        }
        // Kiem tra email da ton tai hay chua
        const userExist =  await User.findOne({email : data.email});
        if(userExist) {
            return res.status(400).json({message : "Email da ton tai , vui long nhap email khac"});
        }
        const hashedPassword = await bcryptjs.hash(req.body.password ,10);  
        // Khoi tao user trong db 
        const user = await User.create({
            ...req.body, 
            password: hashedPassword
        });
        // Xoa password trong ket qua tra ve
        user.password  = undefined;
        // Thong bao cho nguoi dung 
        // return res.status(200).json ( { 
        //     message : "Dang ky thanh cong",
        // })
        res.redirect('/formlogin');
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}
exports.login = async (req, res ) => {
    try {
        const user = await User.findOne({email : req.body.email})
        if(!user) {
            return res.status(400).json({
                message : "Email khong ton tai , ban can dang ky tai khoan"
            })
        }
        const isMatch = await bcryptjs.compare(req.body.password , user.password);
        if(!isMatch) {
            return res.status(400).json({
                message : "Mat khau khong dung!" 
            })
        }
        const  accesToken =  jwt.sign({_id: user._id},'BoCuanViDai' , {expiresIn : '7d'});
        user.password = undefined;
        // return res.status(200).json({
        //     message : "Dang nhap thanh cong",
        //     user : user,
        //     accesToken : accesToken
        // })
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

exports.formlogin = async (req, res ) => { 
    try {
        res.render("login");
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}
exports.formregister = async (req, res ) => { 
    try {
        res.render("register");     
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}