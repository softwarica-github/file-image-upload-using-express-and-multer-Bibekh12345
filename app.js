const express = require('express');
const connection = require('express')
const app = express();
const path = require('path');
const multer = require('multer');
const ejs = require('ejs');


app.use(connection.static(path.join(__dirname,'resources')))
app.set('views',__dirname+'/views')

app.set('view engine','ejs');

//set storage
  const disk = multer.diskStorage({
//passing object
destination:'./resources/uploads/' ,
//location where we want to upload the our image
filename: function(req, file, cb)
{
	cb(null,file.originalname + '-' + Date.now() +
		path.extname(file.originalname)); 
}

  });

  //init upload

  const upload = multer({
  	storage: disk,
  	limits:{fileSize: 400000},
  	fileFilter: function(req,file,cb){
  		checkFileType(file,cb);
  	}

  }).single('uploadedimage');

  function checkFileType(file,cb){
  	const filetypes = /png|jpg|jpeg|gif/;
  	const extname = filetypes.test(path.extname(file.originalname)
  		.toLowerCase());
  	const mimetype = filetypes.test(file.mimetype);
  	  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
  }

app.get('/',(req,res)=>{


res.render("index");

});

app.post('/imageadded',(req,res)=>
{
	upload(req, res, (err) =>{
if(err){
	res.render('index',{
		msg: err
	} );
}else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }

	});
});

const port = process.env.PORT || 22176;
app.listen(port,()=>console.log('server is working'));	 