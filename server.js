const request = require("request");
const express=require("express")
const bodyParser=require("body-parser");
var multer  = require('multer');
const fs = require('fs');

// const fetch =require("node-fetch");
// import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var getUserMedia = require('getusermedia');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    console.log(file.mimetype);
    cb(null, Date.now() + '.wav') //Appending .mp3
  }
})

var upload = multer({ storage: storage });
var type = upload.single('upl');





app.get("/", (req,res)=>{

    res.sendFile(__dirname+"/index.html");
    
   
        
});

app.post("/",type,(req,res)=>{

  
  
  console.log("inside post");
  console.log(req.body);
  console.log("file is below");
  // var jsonreq=JSON.stringify(req);
  // console.log(req);
  console.log(req.file);
  const myfile=req.file;
  
  console.log(myfile.filename);
      // console.log( "this is of type", typeof(req.file));

  const songname= __dirname + '/public/uploads/' + req.file.filename;
  console.log(typeof songname);
  console.log(songname);


  const options = {
    method: 'POST',
    url: 'https://shazam-core.p.rapidapi.com/v1/tracks/recognize',
    headers: {
      'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
      'X-RapidAPI-Key': 'bdba7736c9mshdcee368220f321bp19a210jsn47c5d4112f40',
      'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com',
      useQueryString: true
    },
    formData: {
      file: {
        value: fs.createReadStream(songname),
        options: {filename: songname, contentType: 'audio/wav'}
      }
    }
  };

  request(options, function (error, response, body) {

    console.log(body);
    if (error){
      console.log("there is error"+error);
    } else
    console.log(response.statusCode);
  });

    
  });

  // res.redirect(307,'/detected');
//   const myfile=new File([req.file], 'curraudio.mpeg', {
//     type: myBlob.type,
// });
// console.log(typeof (myfile));
  // var url=req.body.urlname;
  // console.log(url);
  // let blob = await fetch(req.body.urlname ).then( r => r.blob()).catch(err=>console.log(err));

  // let file = await fetch(url).then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "audio/mpeg" }))


app.post("/detected",(req,res)=>{

  res.send("<h1>song detected</h1>");
})
    

// app.post("/")
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     console.log("getUserMedia supported.")



app.listen(3000,function(){
    console.log("Server started on port 3000");
});