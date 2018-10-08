    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var fs = require('fs');
    var url = require('url');
    var imageDir = './upload/';
    var httpDir = 'http://localhost:3000/readImage/';

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './upload/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });
    
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        console.log(req.file);
        upload(req,res,function(err){
			console.log(req.file);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

    app.get('/readImage/:id', function(req, res) {
        pic = req.params.id
        fs.readFile(imageDir + pic, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
       
    });

    app.get('/getImageUrls', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var imageUrlArray = [];
        fs.readdir(imageDir, function(err, items) {
            for (var i=0; i<items.length; i++) {
                var file = httpDir + items[i];

                imageUrlArray.push(file);
                
            }
            res.send(JSON.stringify({ imageUrlArrayResult : imageUrlArray }));
        });
    });
    // fs.readdir(path, function(err, items) {
    //     for (var i=0; i<items.length; i++) {
    //         var file = path + '/' + items[i];
    //         console.log("Start: " + file);
     
    //         fs.stat(file, function(err, stats) {
    //             console.log(file);
    //             console.log(stats["size"]);
    //         });
    //     }
    // });

    app.listen('3000', function(){
        console.log('running on 3000...');
    });