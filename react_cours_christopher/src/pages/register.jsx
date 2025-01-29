import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(register({ email, password }));
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/login');
    }
  }, [auth.isAuthenticated, navigate]);

  return (
      <div className="register-page">
        <h2>Register</h2>
        <p>Create your account below.</p>
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
            {auth.status === 'loading' ? 'Inscription en cours...' : 'Register'}
          </button>
          {auth.status === 'failed' && <p>{auth.error?.message || JSON.stringify(auth.error)}</p>}
        </form>
      </div>
  );
};

export default Register;