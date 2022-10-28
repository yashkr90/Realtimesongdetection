const request = require("request");
const express=require("express")
const bodyParser=require("body-parser");
var multer  = require('multer');
const fs = require('fs');
const path = require("path");
require('dotenv').config()
console.log(process.env);
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const port=3000;
// console.log(process.env.NODE_ENV);
var enviroment=process.env.NODE_ENV ||'development';
console.log(enviroment);
// const fetch =require("node-fetch");
// import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var getUserMedia = require('getusermedia');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));
app.use(express.json());

app.set('view engine', 'ejs');

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

var lyrics={};
var lyricsarr=[];
const api_key=process.env.API_KEY;

app.get("/", (req,res)=>{

    res.sendFile(__dirname+"/index.html");
    
   
        
});

app.post("/",type,(req,res)=>{

  
  // res.sendFile(__dirname+'/success.html');
  console.log("inside post");
  console.log(req.body);
  console.log("file is below");
  // var jsonreq=JSON.stringify(req);
  // console.log(req);
  console.log(req.file);//gives the blob file
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
      'X-RapidAPI-Key': api_key,
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

    // console.log(body);

    if (error){
      console.log("there is error"+error);
      unlinkAsync(req.file.path);
    } 
    else
    {
      console.log(response.statusCode);
      if(response.statusCode===200)
      {
        res.json({
          status:'pass',
          resbody:body,
          statuscode:response.statusCode
        });
        unlinkAsync(req.file.path);
        // res.redirect(307,'/detected');
        // res.sendFile(__dirname+'/success.html');
      }
      else
      {
        console.log("failes to detect");
        // res.send("failed");
        // res.sendFile(__dirname+"/failure.html", function(err) { if (err) console.log(err); })
        // res.redirect(308,'/detected');
        // res.sendFile(path.resolve(__dirname+"/failure.html"));
        res.json({
          status:'failed',
          resbody:body,
          statuscode:response.statusCode
        });
        unlinkAsync(req.file.path);
      }
    }
  });

    
  });

  app.post("/failure",(req,res)=>{

    console.log("inside failure");
    
    res.sendFile(__dirname+"/failure.html");
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

  console.log("insode detected")
  console.log(req.body);
    console.log(req.body.imgsrc);
    console.log(typeof req.body.lyrics);
    console.log("lyrics is");
    console.log(lyrics);
    console.log(lyrics[1]);
    // for(var i=0; lyrics.length ;i+=1 )
    // {
    //   lyricsarr.push(lyrics[i]);
    // }
    var size=Object.keys(lyrics).length;
    console.log(size);
    if(size>0){
    lyrics.forEach(element => {
      lyricsarr.push(element);
    })
  }
    // lyricsarr.push(lyrics[1]);
    // lyricsarr.push(lyrics[2]);
    console.log(lyricsarr);
    console.log(typeof lyricsarr);
    var imgsrc=req.body.imgsrc;
    var artistname=req.body.artistname;
    var trackname=req.body.trackname;
    var artistimage=req.body.artistimage;
    var genres=req.body.genres;
    var yturl=req.body.yturl;
    res.render('success' , {artistname:artistname,trackname: trackname,imgsrc: imgsrc, lyricsarr: lyricsarr,artistimage:artistimage,genres:genres,yturl:yturl});

    // var arraylyrics=Object.values(lyrics);
    // console.log(typeof arraylyrics);


  // res.sendFile(__dirname+"/success.html");
  // res.sendFile("public/html/failure.html",{ root : __dirname});
})
    

// app.post("/")
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     console.log("getUserMedia supported.")

app.post("/redirect",(req,res)=>{
  lyricsarr=[];
  res.redirect('/');
})

app.post("/putval",(req,res)=>{

  console.log("inside putval");
  // console.log("req is"+req);//when writing string infront it makes whole thing as string
  console.log(req.body);
  console.log(typeof req.body);
  lyrics=req.body;
  // console.log('req.file is'+req.file);
  console.log(lyrics);
  res.json({});

  // console.log('file is of type'+typeof req.file);
  // lyrics=req.file;
  // console.log('lyrics converted to json' +typeof JSON.stringify(lyrics));

})

app.listen(process.env.PORT || port,function(){
    console.log("Server started on port 3000");
});

//bdba7736c9mshdcee368220f321bp19a210jsn47c5d4112f40

//saketapi 93948ec041msh9f1ef4500797f4ap198fc9jsna9559c16dff0