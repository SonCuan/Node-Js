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
        app.get('/list', ProductControllers.getList);
        app.get('/create', ProductControllers.create);
        app.get('/update/:id', ProductControllers.getDetail);
        app.post('/save',upload.single('images'), ProductControllers.save);
        app.post('/update/:id',upload.single('images'), ProductControllers.update);
        app.get('/delete/:id', ProductControllers.delete);
        app.listen(port, () => {
            console.log(`running in port ${port}`);
        })
    })
    .catch(err => {
        console.error(err);
})