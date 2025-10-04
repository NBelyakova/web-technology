import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_AUTH_URL = 'http://localhost:8000/auth/';
const API_USER_URL = 'http://localhost:8000/users/me/';

async function fetchUser(token) {
  const response = await fetch(API_USER_URL, {
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

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Введите логин и пароль');
      return;
    }

    try {
      const response = await fetch(API_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError('Неверный логин или пароль');
        } else {
          setError('Ошибка сервера при входе');
        }
        return;
      }

      const data = await response.json();
      const token = data.access;

      localStorage.setItem('token', token);

      // Получаем полные данные пользователя
      try {
        const userData = await fetchUser(token);
        // Передаём полные данные пользователя и токен наверх
        onLogin({ user: userData, token });
        navigate('/posts');
      } catch (userError) {
        setError('Не удалось получить данные пользователя');
        localStorage.removeItem('token');
      }

    } catch (e) {
      setError('Ошибка сети');
    }
  }

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <p>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
    </div>
  );
}

export default LoginPage;