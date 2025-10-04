import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

// Функция получения данных пользователя по токену
async function fetchUser(token) {
  const response = await fetch('http://localhost:8000/users/me/', {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось получить данные пользователя');
  }
  return response.json();
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Загружаем пользователя при наличии токена
  useEffect(() => {
    if (token) {
      fetchUser(token).then(setUser).catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  // После логина
  async function handleLogin(userData) {
    setToken(userData.token);
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }

  function handleRegister(token) {
    setToken(token);
    localStorage.setItem('token', token);
    // После регистрации нужно также получить данные пользователя
    fetchUser(token).then(setUser);
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          !token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />
        } />
        <Route path="/register" element={
          !token ? <RegisterPage onRegister={handleRegister} /> : <Navigate to="/dashboard" />
        } />
        <Route path="/dashboard" element={
          token ? <Dashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        <Route path="/" element={
          <Navigate to={token ? "/dashboard" : "/login"} />
        } />
      </Routes>
    </Router>
  );
}

export default App;