import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room, onLeave }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  async function sendMessage() {
    if (currentMessage) {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes =
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();

      const ampm = now.getHours() < 12 ? "AM" : "PM";

      const userMessage = {
        username,
        id: crypto.randomUUID(),
        room,
        message: currentMessage,
        time: `${hours}:${minutes} ${ampm}`,
      };

      await socket.emit("send_message", userMessage);
      setMessageList((prevMsg) => [...prevMsg, userMessage]);
      setCurrentMessage("");
    }
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((prevMsg) => [...prevMsg, data]);
    });

    return () => {
      setMessageList("");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
        <span onClick={() => onLeave()}> &chi;</span>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.length > 0 &&
            messageList.map((message) => (
              <div
                key={message.id}
                className="message"
                id={username === message.username ? "you" : "other"}
              >
                <div className="content">
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{message.time}</p>
                    <p id="author">{message.username}</p>
                  </div>
                </div>
              </div>
            ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="message ... "
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
