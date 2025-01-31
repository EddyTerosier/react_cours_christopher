import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatBox from "./pages/ChatBox";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/chat" element={<ChatBox />} />
                </Routes>
        </Router>
    );
}

export default App;