import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatches } from "../../redux/slices/matchesSlice";
import { getMessagesBetween } from "../../services/apiService";
import "./ChatBox.css";

const socket = io(import.meta.env.VITE_API_URL);

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;
  const email = user?.email;

  const { matches, status, error } = useSelector((state) => state.matches);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
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
      console.log("User re-registered with Socket ID:", userId);
    });
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    dispatch(fetchMatches());
    return () => {
      socket.off("receiveMessage");
      socket.off("userRegistered");
    };
  }, [userId, email, dispatch]);

  const matchedUsers = matches
    .map((match) => match.users.find((u) => u._id !== userId))
    .filter(Boolean);

  const selectReceiver = (id) => {
    setReceiverId(id);
    getMessagesBetween(userId, id)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Erreur chargement des messages:", err));
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="fw-bold">{email}</div>
        </div>
        <div className="overflow-auto">
          {status === "loading" && <p>Chargement des matchs...</p>}
          {error && <p>{error}</p>}
          {matchedUsers.length === 0 && status === "succeeded" && (
            <p>Aucun match pour le moment</p>
          )}
          {matchedUsers.map((matchedUser) => (
            <div
              key={matchedUser._id}
              onClick={() => selectReceiver(matchedUser._id)}
              className={`chat-sidebar-user ${
                receiverId === matchedUser._id ? "active" : ""
              }`}
            >
              {matchedUser.email}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        {receiverId ? (
          <>
            <div className="chat-header">
              <h5 className="mb-0">
                {matchedUsers.find((u) => u._id === receiverId)?.email}
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
            Sélectionnez un match pour discuter
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
