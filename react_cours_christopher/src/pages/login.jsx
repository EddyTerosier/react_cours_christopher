import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.status === 'succeeded') {
      navigate('/');
    }
  }, [auth.isAuthenticated, auth.status, navigate]);

  return (
      <div className="login-page">
        <h2>Login</h2>
        <p>Welcome to the login page!</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <label htmlFor="password">Password:</label>
          <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button type="submit" disabled={auth.status === 'loading'}>
            {auth.status === 'loading' ? 'Connexion en cours...' : 'Login'}
          </button>
          {auth.status === 'failed' && <p>{auth.error?.message || JSON.stringify(auth.error)}</p>}
        </form>
      </div>
  );
};

export default Login;