import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./redux/slices/authSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import ChatBox from "./pages/Chatbox/chatBox.jsx";
import Home from "./pages/Home/home.jsx";
import Login from "./pages/Login/login.jsx";
import Register from "./pages/Register/register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/base/Navbar/Navbar";

function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function NoNavbarLayout() {
  return <Outlet />;
}

function App() {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !user) {
            dispatch(getMe());
        }
    }, [token, user, dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBox />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route element={<NoNavbarLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;