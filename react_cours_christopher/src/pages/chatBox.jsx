import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:4000");

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [users, setUsers] = useState([]);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the latest message
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
        // Check for stored email and handle user registration
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

        // Socket event listeners
        socket.on("userRegistered", ({ userId }) => {
            setUserId(userId);
            fetch("http://localhost:4000/users")
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Erreur chargement utilisateurs:", err));
        });

        socket.on("usersList", (usersList) => {
            setUsers(usersList);
        });

        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup socket listeners
        return () => {
            socket.off("receiveMessage");
            socket.off("userRegistered");
            socket.off("usersList");
        };
    }, []);

    // Load previous messages when selecting a user
    const selectReceiver = (id) => {
        setReceiverId(id);
        fetch(`http://localhost:4000/messages/${userId}/${id}`)
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error("Erreur chargement des messages:", err));
    };



    const handleLogout = () => {
        sessionStorage.removeItem("email");
        window.location.reload();
    };

    // Custom styles for elements that need specific dimensions
    const styles = {
        container: {
            height: "100vh",
            maxHeight: "100vh",
        },
        sidebar: {
            width: "300px",
            borderRight: "1px solid #dee2e6"
        },
        messageContainer: {
            height: "calc(100vh - 130px)",
            overflowY: "auto"
        }
    };

    return (
        <div className="d-flex bg-light" style={styles.container}>
            {/* Left sidebar - Users list */}
            <div className="bg-white" style={styles.sidebar}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div className="fw-medium text-dark">
                        {email}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-secondary btn-sm"
                    >
                        Déconnexion
                    </button>
                </div>
                <div className="overflow-auto h-100">
                    {users.map((user) =>
                            user._id !== userId && (
                                <div
                                    key={user._id}
                                    onClick={() => selectReceiver(user._id)}
                                    className={`p-3 user-select-none ${
                                        receiverId === user._id ? 'bg-primary text-white' : 'text-dark'
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {user.email}
                                </div>
                            )
                    )}
                </div>
            </div>

            {/* Right side - Chat window */}
            <div className="flex-grow-1 d-flex flex-column">
                {receiverId ? (
                    <>
                        {/* Chat header */}
                        <div className="p-3 border-bottom bg-white">
                            <h5 className="mb-0">
                                {users.find(user => user._id === receiverId)?.email}
                            </h5>
                        </div>

                        {/* Messages area */}
                        <div className="p-3" style={styles.messageContainer}>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-3 ${
                                        msg.sender?._id === userId ? 'justify-content-end' : 'justify-content-start'
                                    }`}
                                >
                                    <div
                                        className={`p-3 rounded-3 ${
                                            msg.sender?._id === userId
                                                ? 'bg-primary text-white'
                                                : 'bg-secondary bg-opacity-10 text-dark'
                                        }`}
                                        style={{ maxWidth: '70%', wordBreak: 'break-word' }}
                                    >
                                        <strong className="d-block mb-1">{msg.sender?.email}</strong>
                                        <div>{msg.text}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message input */}
                        <div className="border-top p-3 bg-white">
                            <form onSubmit={sendMessage} className="d-flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="form-control"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                >
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