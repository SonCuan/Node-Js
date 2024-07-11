//khởi tạo server
const express = require('express'); //require module express
const app = new express();
const port = 3000; //khai báo cổng sẽ chạy server
var bodyParser = require('body-parser');
const multer = require('multer');
// Phan luu tru anh 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })
// End phan luu anh 

//khai báo sử dụng ejs
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: true}));

//router: tạo ra 2 trang, 1 là trang danh sách, 2 là trang tạo mới
app.get('/list', (req,res,next) => {
    //req.params: nằm trong url
    //req.query: ngăn cách bằng dấu ?query1=x&query2=y
    //req.body gửi qua form 
    let product = [{
        id: 1,
        name: 'T-Shirt',
        price: 1000
    },
    {
        id: 2,
        name: 'T-Shirt 2',
        price: 2000
    },
    {
        id: 3,
        name: 'T-Shirt 3',
        price: 3000
    }];

    res.render('list', 
        {
            products: product
        });
});

app.get('/create', (req,res,next) => {
    res.render('create');
})


app.listen(port, () => {
    console.log(`SV dang chay o port ${port}`);
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

app.post('/upload', upload.single('images'), (req, res) => {
    
})