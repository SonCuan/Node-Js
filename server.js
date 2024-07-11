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
app.post('/create', (req,res,next) => {
    let a = req.body.a;
    let b = req.body.b;
    let c = req.body.c;

    if (a == 0) {     
        if (b != 0) {
            let x = -c / b;
            res.send(`Phuong trình có 1 nghiệm: x = ${x}`);
        } else {
            if (c == 0) {           
                res.send('Phuong trình co vô so nghiem');
            } else {
              res.send('Phuong trinh vo nghiem');
            }
        }
    }else{
        let delta = b * b - 4 * a * c;
        if (delta > 0) {
            let x1 = (-b + Math.sqrt(delta)) / (2 * a);
            let x2 = (-b - Math.sqrt(delta)) / (2 * a);
            res.send(`Phuong trinh co 2 nghiem phan biet: x1 = ${x1}, x2 = ${x2}`);
        } else if (delta === 0) {
            let x = -b / (2 * a);
            res.send(`Phuong trinh co nghiem kep: x = ${x}`);
        } else {
            res.send('Phuong trinh vo nghiem');
        }
    }
 
})