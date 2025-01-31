import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Home = () => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="container text-center">
            <h2 className="mb-4">Welcome to the Home Page</h2>
            <nav>
                <ul className="list-unstyled d-flex justify-content-center gap-3">
                    {!auth.token && <li><Link className="btn btn-primary" to="/login">Login</Link></li>}
                    {!auth.token && <li><Link className="btn btn-secondary" to="/register">Register</Link></li>}
                    <li><Link className="btn btn-info" to="/chat">Chat</Link></li>
                    {auth.token && <li><button className="btn btn-danger" onClick={handleLogout}>Logout</button></li>}
                </ul>
            </nav>
        </div>
    );
};

export default Home;