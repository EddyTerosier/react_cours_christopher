import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './redux/store';
import Login from './pages/login';
import Register from './pages/register';
import Home from "./pages/home.jsx";
import { Provider } from "react-redux";
import ProtectedRoute from "./pages/protectedRoute.jsx";
import Scroll from "./pages/scroll.jsx";

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes className="App">
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/scroll" element={<ProtectedRoute><Scroll /></ProtectedRoute>} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;