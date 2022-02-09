import logo from './logo.svg';
import './App.css';
import { createConsumer } from "@rails/actioncable"

function App() {
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
      </header>
    </div>
  );
}

export default App;
