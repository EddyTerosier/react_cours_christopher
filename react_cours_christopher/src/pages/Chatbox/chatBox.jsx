import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import "./ChatBox.css";

const socket = io("http://localhost:4000");

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);

  const auth = useSelector((state) => state.auth);
  const userId = auth?.user?._id;
  const email = auth?.user?.email;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (input.trim() && receiverId && userId) {
      const message = { sender: userId, receiver: receiverId, text: input };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  useEffect(() => {
    if (!userId || !email) return;

    socket.emit("registerUser", email);

    socket.on("userRegistered", ({ userId }) => {
      console.log("User re-registered with Socket ID, userId:", userId);
    });

    socket.on("usersList", (usersList) => {
      setUsers(usersList);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userRegistered");
      socket.off("usersList");
    };
  }, [userId, email]);

  const selectReceiver = (id) => {
    setReceiverId(id);
    fetch(`http://localhost:4000/messages/${userId}/${id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Erreur chargement des messages:", err));
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="fw-bold">{email}</div>
        </div>
        <div className="overflow-auto">
          {users.map(
            (user) =>
              user._id !== userId && (
                <div
                  key={user._id}
                  onClick={() => selectReceiver(user._id)}
                  className={`chat-sidebar-user ${
                    receiverId === user._id ? "active" : ""
                  }`}
                >
                  {user.email}
                </div>
              ),
          )}
        </div>
      </div>

      {/* Main chat */}
      <div className="chat-main">
        {receiverId ? (
          <>
            <div className="chat-header">
              <h5 className="mb-0">
                {users.find((u) => u._id === receiverId)?.email}
              </h5>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message-row ${
                    msg.sender?._id === userId
                      ? "chat-message-sent"
                      : "chat-message-received"
                  }`}
                >
                  <div
                    className={`chat-bubble ${
                      msg.sender?._id === userId
                        ? "chat-bubble-sent"
                        : "chat-bubble-received"
                    }`}
                  >
                    <strong className="d-block mb-1">
                      {msg.sender?.email}
                    </strong>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
              <form onSubmit={sendMessage} className="d-flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send a message..."
                  className="form-control"
                />
                <button type="submit" className="btn px-4 btn-send">
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
