import React, { useEffect, useState } from 'react';

const Message = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        socket.onopen = () => {
            console.log('WebSocket connection established.');
            socket.send(JSON.stringify({ type: 'connect', data: 'user' }));
        };

        socket.onmessage = (event) => {
            try {
                const newMessage = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } catch (error) {
                console.error("Received non-JSON message:", event.data);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        }

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && input) {
            ws.send(JSON.stringify({ type: 'message', message: input }));
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.message}</li>
                ))}
            </ul>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Message;