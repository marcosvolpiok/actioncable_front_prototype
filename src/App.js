import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { createConsumer } from "@rails/actioncable";
import Peer from 'peerjs';
const myPeer = new Peer(undefined,
  {
    host: '/',
    port: 3001
  }
);



function App() {
  //var ownVideo = document.getElementById('ownVideo');
  useEffect(()=>{
    console.log('construct');
    var ownVideo = document.createElement('video')
    var grid = document.getElementById('grid');
    console.log('griddd', grid)
    const peers = {};
    let ownVideoSrc = "";
  

    const myVideo = document.createElement('video');
    myVideo.muted = true;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      console.log('addVideoStream 1111')
      addVideoStream(myVideo, stream)  
      myPeer.on('call', call => {
        call.answer(call.stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })
    });
  
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
    
    
    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        video.remove()
      })
    
      peers[userId] = call
    }    
  });





  const consumer = createConsumer('http://127.0.0.1:3000/cable');
  //consumer.subscriptions.create({ channel: "ChatChannel", room: "Best Room" })

  const chatChannel = consumer.subscriptions.create({ channel: "ChatChannel", room: "Best Room" }, {
    received(data) {
      console.log('Recived: ', data["sent_by"], data["body"])
    }
  });

  function send(){
    chatChannel.send({ sent_by: "Paul", body: "This is a cool chat app." });
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
