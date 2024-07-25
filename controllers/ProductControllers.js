const Product = require('../models/ProductModels.js');

// Lay tat ca danh sach san pham 
exports.getList = async (req, res) => {
    try {
        const products = await Product.find();
        res.render("list", {pros:products});
    } catch (error) {
        console.log(error);
    }
}

// Lay thong tin chi tiet 

exports.getDetail = async (req, res) => { 
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.render('update' , {product:product});
    } catch (error) {
        console.log(error);
    }
}

// dieu huong sang form tao moi 
exports.create = (req, res) => {
    res.render('create');
    res.redirect('/list');
}

// Lat dy lieu moi vao db 
exports.save = async ( req, res ) => { 
    const newProduct = {
        name : req.body.name ,
        price : req.body.price,
        images : req.file.filename
    }
    try {
        const product = await 
        Product.create(newProduct);
        res.redirect('/list');
    } catch (error) {
        console.log(error);
    }
}

// Ham cap nhat 
exports.update = async (req, res ) => { 
    const id  = req.params.id;
    let newProduct = {
        name : req.body.name ,
        price : req.body.price,
        images : req.file.filename
    }
    try {
        const product = await Product.findByIdAndUpdate(id, newProduct);
        res.redirect('/list');
    } catch (error) {
        console.log(error);
    }
}

// Xoa san pham
exports.delete = async (req, res ) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(id);
        res.redirect('/list');
    } catch (error) {
        console.log(error);
    }
}