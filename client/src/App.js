import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

// Функция получения данных пользователя по токену
async function fetchUser(token) {
  const response = await fetch('http://localhost:8000/users/me/', {
    headers: {
      'Authorization': `Token ${token}`, // префикс "Token " должен совпадать с серверной настройкой
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось получить данные пользователя');
  }
  return response.json();
}


function App() {
  const [token, setToken] = useState(null); // null если не авторизован
  const [user, setUser] = useState(null);

// После логина
async function handleLogin(token) {
  setToken(token);
  const userData = await fetchUser(token); // получить данные пользователя
  setUser(userData);
}

  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <LoginPage onLogin={setToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <RegisterPage onRegister={setToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard user={user} token={token} onLogout={() => setToken(null)} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
