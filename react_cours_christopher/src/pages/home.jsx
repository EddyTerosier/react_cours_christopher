import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
    return (
    <div className="home-page">
      <h2>Welcome to the Home Page</h2>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </div>
  );
};export default Home;