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
        <div className="home-page">
            <h2>Welcome to the Home Page</h2>
            <nav>
                <ul>
                    {!auth.token && <li><Link to="/login">Login</Link></li>}
                    {!auth.token && <li><Link to="/register">Register</Link></li>}
                    <li><Link to="/scroll">Scroll</Link></li>
                    {auth.token && <li><button onClick={handleLogout}>Logout</button></li>}
                </ul>
            </nav>
        </div>
    );
};

export default Home;