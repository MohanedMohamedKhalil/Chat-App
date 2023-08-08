import "./App.css";
import { useState } from "react";
import { socket } from "./utils/socket";
import Chat from "./components/Chat";

function App() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [showChat, setShowChat] = useState(false);

  function JoinChat() {
    if (username !== "" && roomName !== "") {
      socket.emit("join_chat", roomName); // Triggered Event exists in Back-End
      setShowChat(true);
    }
  }
  function reset() {
    setRoomName("");
    setShowChat(false);
    setUsername("");
  }

  return (
    <div className="App">
      {!showChat ? (
        <div
          className="joinChatContainer"
          onKeyDown={(event) => {
            event.key === "Enter" && JoinChat();
          }}
        >
          <h3 style={{ fontSize: "26px" }}>Join A Chat !</h3>
          <input
            type="text"
            placeholder="Your Name .."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room Name .. "
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button onClick={() => JoinChat()}>Join A Room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={roomName}
          onLeave={reset}
        />
      )}
    </div>
  );
}

export default App;
