import io from "socket.io-client";

import './App.css';
import ScamPage from "./components/scam/ScamPage";

const socket = io.connect("http://localhost:4200/", {
  reconnection: true
});

function App() {



  return (
    <div className="App">
      <div style={{ position: 'fixed' }}>
        <ScamPage socket={socket} />
      </div>
      
      



    </div>
  );
}

export default App;
