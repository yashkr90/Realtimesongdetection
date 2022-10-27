

const record = document.querySelector(".record");
console.log(record.innerHTML);
const stop =document.querySelector(".stop");

var chunks = [];



var datasandstatus={};

    



var device =navigator.mediaDevices.getUserMedia({audio: true,});


device.then((stream)=>{

    const mediaRecorder = new MediaRecorder(stream);
    record.onclick = () => {
        mediaRecorder.start(5000);
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
        console.log("started");
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
      };

      stop.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";
      };

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
      fetch('/', {

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
      )
      
      
      .catch(err => console.log(err));
  }

  function processdata(datasandstatus){

    console.log("inside processdata")
    console.log(typeof datasandstatus);
    console.log(typeof datasandstatus.resbody);
    console.log(datasandstatus.resbody);
    var objdataandstatus=JSON.parse(datasandstatus.resbody);
    console.log(objdataandstatus);
    console.log(typeof objdataandstatus);

    

    if(datasandstatus.statuscode===200)
    {
    var successform=document.getElementById("detected");
    console.log(successform);

    var trackname=objdataandstatus.track.title;
    var artistname=objdataandstatus.track.subtitle;
    var imgsrc=objdataandstatus.track.images.coverarthq;
    var lyrics=objdataandstatus.track.sections[1].text;
    console.log("lyrics is of" +typeof lyrics);
    console.log(lyrics);



    var input1=document.createElement('input')
    var input2=document.createElement('input')
    var input3=document.createElement('input')
    // var input4=document.createElement('input')
      input1.name='artistname';
      input2.name='trackname';
      input3.name='imgsrc';
      // input4.name='lyrics';

      input1.value=artistname;
      input2.value=trackname;
      input3.value=imgsrc;
      // input4.value=lyrics;

      input1.type='hidden';
      input2.type='hidden';
      input3.type='hidden';

      successform.appendChild(input1);
      successform.appendChild(input2);
      successform.appendChild(input3);
      // successform.appendChild(input4);

      fetch("/putval",{
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
      var failureform=document.getElementById("failure");
      console.log(failureform);

      var input1=document.createElement('input')
      var input2=document.createElement('input')
      var input3=document.createElement('input')
        input1.name='artistname';
        input2.name='trackname';
        input3.name='imgsrc';
  
        input1.value='alan';
        input2.value='faded';
        input3.value='someurl';

        input1.type='hidden';
        input2.type='hidden';
        input3.type='hidden';

      failureform.appendChild(input1);
      failureform.appendChild(input2);
      failureform.appendChild(input3);

      failureform.submit();
    }

  }
