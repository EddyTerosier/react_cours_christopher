import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChatBox.css";

const socket = io("http://localhost:4000");

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (input.trim() && receiverId) {
      const message = { sender: userId, receiver: receiverId, text: input };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  useEffect(() => {
    let storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      storedEmail = prompt("Entrez votre email:");
      if (storedEmail) {
        sessionStorage.setItem("email", storedEmail);
      } else {
        return;
      }
    }
    setEmail(storedEmail);
    socket.emit("registerUser", storedEmail);

    socket.on("userRegistered", ({ userId }) => {
      setUserId(userId);
      fetch("http://localhost:4000/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Erreur chargement utilisateurs:", err));
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
  }, []);

  const selectReceiver = (id) => {
    setReceiverId(id);
    fetch(`http://localhost:4000/messages/${userId}/${id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Erreur chargement des messages:", err));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("email");
    window.location.reload();
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="fw-bold">{email}</div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-secondary btn-sm"
          >
            Déconnexion
          </button>
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
                  placeholder="Écrire un message..."
                  className="form-control"
                />
                <button type="submit" className="btn px-4 btn-send">
                  Envoyer
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
            Sélectionnez un utilisateur pour commencer une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
