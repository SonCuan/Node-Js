const express = require ('express');
const mongoose = require('mongoose');
const ProductControllers = require('./controllers/ProductControllers');
var  multer = require('multer');

const app =  express();
const port = 3000;
app.set('view engine', 'ejs');
app.set ('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({storage: storage});

mongoose.connect('mongodb://127.0.0.1:27017/Web503')
    .then(result => {
        app.get('/product', ProductControllers.getList);
        // app.post('/product', ProductControllers.create); // tao san pham moi bang phuong thuc post 
        app.get('/product/:id', ProductControllers.getDetail);
        app.post('/product',upload.single('images'), ProductControllers.save); // them san pham 
        app.put('/product/:id',upload.single('images'), ProductControllers.update);
        app.delete('/product/:id', ProductControllers.delete);
        app.listen(port, () => {
            console.log(`running in port ${port}`);
        })
    })
    .catch(err => {
        console.error(err);
})