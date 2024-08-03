const Product = require('../models/ProductModels.js');

// Lay tat ca danh sach san pham 
exports.getList = async (req, res) => {
    try {
        const products = await Product.find();
        if(!products.length === 0 ) {
            return res.status(400).json({
                message : "Khong tim thay san pham",
                
            })
        }
        return res.status(200).json({
            message : "Tim thay san pham thanh cong",
            data : products,
        })
    } catch (error) {
       return res.status(500).json({
        message : error.message 
       })
    }
}

// Lay thong tin chi tiet 

exports.getDetail = async (req, res) => { 
    try {
        const product = await Product.findById(req.params.id);
        if(!product) { 
            return res.status(404).json({
                message : "Khong tim thay san pham",
            })
        }
        return res.status(200).json({
            message : "Tim thay san pham thanh cong",
            data : product,
        })
    } catch (error) {
       return res.status(500).json({
        message : error.message
       })
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
        images : req.body.images
    }
    try {
        const product = await 
        Product.create(newProduct);
        if ( !product ) { 
            return res.status(400).json({
                message : "Them san pham that bai ",
            })
        }
        res.status(200).json({
            message : "Them san pham thanh cong ",
            data:product, 
        })
    } catch (error) {
        return res.status (500).json({
            message : error.message
        })
    }
}

// Ham cap nhat 
exports.update = async (req, res ) => { 
    let newProduct = {
        name : req.body.name ,
        price : req.body.price,
        images : req.body.images
    }
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body ,  newProduct);
       if(!product) { 
           return res.status(400).json({
               message : "Cap nhat san pham that bai ",
           })
       }
       return res.status(200).json({
           message : "Cap nhat san pham thanh cong ",
           data : newProduct,
       })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

// Xoa san pham
exports.delete = async (req, res ) => {
    try {
        const data = await Product.findByIdAndDelete(req.params.id);
        if(!data) {
            return res.status(400).json({
                message : "Xoa san pham that bai ",
            })
        }
        return res.status(200).json({
            message : "Xoa san pham thanh cong ",
            data : data,
        })
    } catch (error) {
       return res.status(500).json({
        message : error.message
       })
    }
}

// Phan get list 
exports.listproducts = async (req, res) => {
    try {
        const products = await Product.find();
        
        res.render('list' , {pros : products});
    } catch (error) {
        res.status(500).json({message : error.message})
    } 
}