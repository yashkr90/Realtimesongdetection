

const record = document.querySelector(".record");
console.log(record.innerHTML);
const stop =document.querySelector(".stop");
var body=document.querySelector("body");
var heading=document.querySelector(".writing");
var chunks = [];

const port=3000;
import { constants } from "fs/promises";
// import{config} from './public/js/constants'
var datasandstatus={};
// const url=config.url;
// console.log(url);



var device =navigator.mediaDevices.getUserMedia({audio: true,});


device.then((stream)=>{

    const mediaRecorder = new MediaRecorder(stream);
    record.onclick = () => {
        console.log("inside on click");
        console.log(heading.innerHTML);
        heading.innerHTML='';
        record.classList.remove("breathing");
        record.classList.add("pulsing");
        body.classList.remove("blackgradient");
        body.classList.add("yellowgradient");
        
        mediaRecorder.start(5000);
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
        console.log("started");
        console.log(mediaRecorder.state);
        console.log("recorder started");
        
      };

      // stop.onclick = () => {
      //   mediaRecorder.stop();
      //   console.log(mediaRecorder.state);
      //   console.log("recorder stopped");
      //   record.style.background = "";
      //   record.style.color = "";
      // };

      //when recorder is stopeed data is stored and this data is pushed back in chhunks array
     mediaRecorder.ondataavailable = (e) => {
     chunks.push(e.data);
     };
//when recording is finished on stop event is triggerd
   mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type:"audio/webm" });
    chunks = [];
    
    // var mainaudio=document.createElement('audio');
    
    // var formbody=document.getElementById("audiorec");
    // var button= formbody.firstChild;
    
    // formbody.insertBefore(mainaudio,button);
    const recordedMediaURL = URL.createObjectURL(blob);
                        // <input type="text" name="lname" required></input>
                        // var inp=document.createElement('input');
                        // inp.type='text';
                        // inp.style.display='none';
                        // inp.name='urlname';
                        // inp.value=recordedMediaURL;
                        // var controlss=formbody.firstChild;
                        // formbody.insertBefore(inp,controlss);
    // mainaudio.controls = 'controls';
    // mainaudio.src      = recordedMediaURL;
    // mainaudio.type     = 'audio/wav';
    // mainaudio.name     = 'myaudio';

    console.log(blob);
    console.log(typeof(blob));
    uploadBlob(blob);
   }

  
}
)

.catch((err) => {
    console.log("error occured"+err);
});

function uploadBlob(blob) {
    // Creating a new blob  
      // Hostname and port of the local server
      blob = blob.slice(0, blob.size, "audio/wav")
      var fd = new FormData();
      // const myfile=new File([blob], 'curraudio.mp3');
      
      fd.append('upl', blob, 'blobby.wav');

      // console.log(myfile instanceof File);
      // console.log(typeof myfile);
      
      // myfile.lastModifiedDate = new Date();
      // myfile.name = "curraudio.mpeg";
      console.log("blob fuc called");
      fetch('http://musicrealtime.herokuapp.com', {

          // HTTP request type
          method: "POST",
          // headers:{
          //   'Content-Type':'audio/mpeg'
          // },

          // Sending our blob with our request
          body:fd
      })
      .then(res => {
        console.log(res)
        return res;
        
      }).then((res)=>{
        
        datasandstatus=res.json();
        // console.log(typeof datasandstatus)
        // console.log(datasandstatus);
        return datasandstatus;
      }).then((datasandstatus)=>{

        processdata(datasandstatus);
      }
      ).catch((err)=> console.log(err));
  }

  function processdata(datasandstatus){

    console.log("inside processdata")
    console.log(typeof datasandstatus);
    console.log(typeof datasandstatus.resbody);
    console.log(datasandstatus.resbody);
    var objdataandstatus=JSON.parse(datasandstatus.resbody);
    console.log(objdataandstatus);
    console.log(typeof objdataandstatus);

    const hasKey = objdataandstatus.hasOwnProperty('track');

    if(hasKey && datasandstatus.statuscode===200)
    {
      console.log("inside 200 success");
    var successform=document.getElementById("detected");
    console.log(successform);

    var trackname=objdataandstatus.track.title;
    var artistname=objdataandstatus.track.subtitle;
    var imgsrc=objdataandstatus.track.images.coverarthq;
    var lyrics=objdataandstatus.track.sections[1].text;
    var artistimage=objdataandstatus.track.images.background;
    var genres=objdataandstatus.track.genres.primary;
    var yturl=objdataandstatus.track.hub.providers[1].actions[0].uri;
    console.log("lyrics is of" +typeof lyrics);
    console.log(lyrics);



    var input1=document.createElement('input')
    var input2=document.createElement('input')
    var input3=document.createElement('input')
    var input4=document.createElement('input')
    var input5=document.createElement('input')
    var input6=document.createElement('input')
    // var input4=document.createElement('input')
      input1.name='artistname';
      input2.name='trackname';
      input3.name='imgsrc';
      input4.name='artistimage';
      input5.name='genres';
      input6.name='yturl';
      // input4.name='lyrics';

      input1.value=artistname;
      input2.value=trackname;
      input3.value=imgsrc;
      input4.value=artistimage;
      input5.value=genres;
      input6.value=yturl;
      // input4.value=lyrics;

      input1.type='hidden';
      input2.type='hidden';
      input3.type='hidden';
      input4.type='hidden';
      input5.type='hidden';
      input6.type='hidden';

      successform.appendChild(input1);
      successform.appendChild(input2);
      successform.appendChild(input3);
      successform.appendChild(input4);
      successform.appendChild(input5);
      successform.appendChild(input6);
      // successform.appendChild(input4);

      fetch("http://musicrealtime.herokuapp.com/putval",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lyrics)
      }).then((res)=>{
        console.log('lyricspassed');
      // successform.submit();
    }).catch((err)=>{console.log("error oc")
    console.log(err)});

    successform.submit();
    }
    
    else{

      console.log("inside failed");
      var failureform=document.getElementById("failure");
      console.log(failureform);
      failureform.submit();
    }

  }
