import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { createConsumer } from "@rails/actioncable";
import Peer from 'peerjs';
var myPeer = new Peer(undefined,
  {
    host: '/',
    port: 3001
  }
);





function App() {
  //var ownVideo = document.getElementById('ownVideo');
  useEffect(()=>{
    console.log('construct');
    var grid = document.getElementById('grid');
    console.log('griddd', grid)
    const peers = {};
  

    const myVideo = document.createElement('video');
    myVideo.muted = true;


    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      console.log('addVideoStream 1111', stream)
      addVideoStream(myVideo, stream)  
      myPeer.on('call', call => {
        call.answer(call.stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })

 
     
    });



  

    const consumer = createConsumer('http://127.0.0.1:3000/cable');
    //consumer.subscriptions.create({ channel: "ChatChannel", room: "Best Room" })
  
    const chatChannel = consumer.subscriptions.create({ channel: "ChatChannel", room: "Best Room" }, {
      received(data) {
        console.log('data received', data)
        //console.log('Recived: ', data["sent_by"], data["body"])
        if(data["body"]=="join-room"){
          navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          }).then(stream => {
            connectToNewUser(data["sent_by"], stream);
          });
        }
  
  
        function connectToNewUser(userId, stream) {
          console.log('new user - connect', myPeer);

          const call = myPeer.call(userId, stream)
          const video = document.createElement('video')
          call.on('stream', userVideoStream => {
            console.log('llegó a stream')
            addVideoStream(video, userVideoStream)
          })
          call.on('close', () => {
            video.remove()
          })
        
          peers[userId] = call
        }      
  
        //   socket.on('user-connected', userId => {
        //     connectToNewUser(userId, stream)
        //   })
        // })
        
        // socket.on('user-disconnected', userId => {
        //   if (peers[userId]) peers[userId].close()
        // })      
      }
    });    

    myPeer.on('open', id => {
      console.log('open')
      chatChannel.send({ sent_by: id, body: "join-room"});
      //chatChannel.send({ action: "join-room", id: id});
      //chatChannel.send({ sent_by: "Paul", body: "This is a cool chat app." });
    })



    function addVideoStream(video, stream) {
      console.log('videooooooooo', video);
      video.srcObject = stream
      //ownVideoSrc = stream;
      video.addEventListener('loadedmetadata', () => {
        console.log('loadedmetadata', video)
        video.play();
        //video.play()
      })
      grid.append(video)
    }      



  });







  function send(){
    //chatChannel.send({ sent_by: "Paul", body: "This is a cool chat app." });
  }

  function handleClick(){


  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <button onClick={() => send()}>Send message</button>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>


        <div id="grid"></div>

        <button onClick={() => handleClick()}></button>
      </header>
    </div>
  );
}

export default App;
