

const record = document.querySelector(".record");
console.log(record.innerHTML);
const stop =document.querySelector(".stop");

var chunks = [];





    



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
    
    var mainaudio=document.createElement('audio');
    
    var formbody=document.getElementById("audiorec");
    var button= formbody.firstChild;
    // var button= document.getElementById("btnsub").parentnode;
    formbody.insertBefore(mainaudio,button);
    const recordedMediaURL = URL.createObjectURL(blob);
    // <input type="text" name="lname" required></input>
    // var inp=document.createElement('input');
    // inp.type='text';
    // inp.style.display='none';
    // inp.name='urlname';
    // inp.value=recordedMediaURL;
    // var controlss=formbody.firstChild;
    // formbody.insertBefore(inp,controlss);
    mainaudio.controls = 'controls';
    mainaudio.src      = recordedMediaURL;
    mainaudio.type     = 'audio/wav';
    mainaudio.name     = 'myaudio';

    console.log(blob);
    console.log(typeof(blob));
    uploadBlob(blob);
   }

  
}
)

.catch((err) => {
    console.log("error occured");
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
      .then(res => console.log('Blob Uploaded'))
      .catch(err => console.log(err));
  }

