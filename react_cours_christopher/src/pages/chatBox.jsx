import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";

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

    const styles = {
        container: {
            height: "100vh",
            maxHeight: "100vh",
        },
        sidebar: {
            width: "300px",
            borderRight: "1px solid #dee2e6",
        },
        messageContainer: {
            height: "calc(100vh - 130px)",
            overflowY: "auto",
        },
    };

    return (
        <div className="d-flex bg-light" style={styles.container}>
            <div className="bg-white" style={styles.sidebar}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div className="fw-medium text-dark">
                        {email || "Utilisateur inconnu"}
                    </div>
                </div>
                <div className="overflow-auto h-100">
                    {users.map((user) =>
                            user._id !== userId && (
                                <div
                                    key={user._id}
                                    onClick={() => selectReceiver(user._id)}
                                    className={`p-3 user-select-none ${
                                        receiverId === user._id
                                            ? "bg-primary text-white"
                                            : "text-dark"
                                    }`}
                                    style={{ cursor: "pointer" }}
                                >
                                    {user.email}
                                </div>
                            )
                    )}
                </div>
            </div>

            {/* Fenêtre de chat */}
            <div className="flex-grow-1 d-flex flex-column">
                {receiverId ? (
                    <>
                        {/* En-tête du chat */}
                        <div className="p-3 border-bottom bg-white">
                            <h5 className="mb-0">
                                {users.find((u) => u._id === receiverId)?.email}
                            </h5>
                        </div>

                        {/* Liste des messages */}
                        <div className="p-3" style={styles.messageContainer}>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-3 ${
                                        msg.sender?._id === userId
                                            ? "justify-content-end"
                                            : "justify-content-start"
                                    }`}
                                >
                                    <div
                                        className={`p-3 rounded-3 ${
                                            msg.sender?._id === userId
                                                ? "bg-primary text-white"
                                                : "bg-secondary bg-opacity-10 text-dark"
                                        }`}
                                        style={{
                                            maxWidth: "70%",
                                            wordBreak: "break-word",
                                        }}
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

                        {/* Champ de saisie */}
                        <div className="border-top p-3 bg-white">
                            <form onSubmit={sendMessage} className="d-flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="form-control"
                                />
                                <button type="submit" className="btn btn-primary px-4">
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