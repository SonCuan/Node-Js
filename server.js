//khởi tạo server
const express = require('express'); //require module express
const fs = require('fs');
const app = new express();
const port = 3000; //khai báo cổng sẽ chạy server
var bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql'); // noi ket noi co so du lieu

// Phan ket noi co so du lieu mySQl
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web503'
});
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('ket noi thanh cong');
    }
});
// End phan ket noi co so du lieu mySQl

// Phan luu tru anh 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images') // khai bao duong dan thu muc luu tru file 
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}-${file.originalname}`)  // luu tru file kem theo thoi diem upload 
    }
  })
  
const upload = multer({ storage: storage })
// End phan luu anh 

//khai báo sử dụng ejs

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: true}));

//router: tạo ra 2 trang, 1 là trang danh sách, 2 là trang tạo mới
app.get('/list', (req,res,next) => {
    //req.params: nằm trong url
    //req.query: ngăn cách bằng dấu ?query1=x&query2=y
    //req.body gửi qua form 

    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('list', {pros : results} );
    });
});

app.get('/create', (req,res,next) => {
    res.render('create');
})


app.listen(port, () => {
    console.log(`SV dang chay o port ${port}`);
})
// Phan luu tru anh
app.post('/upload', upload.single('images'), (req,res,next) => {
    res.send('Upload thanh cong');
})
// End phan luu anh
app.get('/delete/:img' , (req,res,next) => {
    const img = req.params.img;
    if(img ) { 
        fs.unlink('public/images/' + img, (err) => {    
            if (err) throw err;
        });
        res.send('Xoa thanh cong');
    }
})
app.post('/save', upload.single('images'), (req,res,next) => {
    let name = req.body.name;
    let price = req.body.price;
    let img = req.file.filename;
    let sql = `INSERT INTO products (name, price, images) VALUES ('${name}', '${price}', '${img}')`;
    db.query(sql, (err, results) => {
        if (err){
            console.log(err);
        }else {
            res.redirect('/list');
        }
    });
})
// Phan edit products 
app.get("/update/:id" , (req,res,next) => {
    const id = req.params.id;
    let sql = `SELECT * FROM products WHERE id =?`;
    db.query(sql, [id] , (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('update', {products : results[0]});
        }else { 
            res.send("Khong tim thay san pham");
        }
    })
})
app.post("/update/:id" , upload.single('images'), (req,res,next) => {
    const id = req.params.id;
    let name = req.body.name;
    let price = req.body.price;
    let images = req.file.filename;


    console.log(id, name, price, images);
    let sql = `UPDATE products SET name = '${name}', price = '${price}', images = '${images}' WHERE id = ${id}`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(`Update ${results.affectedRows} row(s)`);
        res.redirect('/list');
    })
})
app.get("/delete/:id" , (req,res,next) => {
    const id = req.params.id;
    console.log(id);
    const sql = `DELETE FROM products WHERE id = ${id}`;
    db.query(sql, [id] , (err, results )=> { 
        if(err) {
            console.log(err);
        }else { 
            res.redirect('/list');
        }
    })
})