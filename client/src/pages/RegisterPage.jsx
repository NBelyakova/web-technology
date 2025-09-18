import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const API_REGISTER_URL = 'http://localhost:8000/register/'; 
  const API_AUTH_URL = 'http://localhost:8000/auth/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        const errMsg = data.detail || JSON.stringify(data);
        setError(`Ошибка регистрации: ${errMsg}`);
        return;
      }

      // Регистрация прошла успешно, теперь логинимся для получения токена
      const authResponse = await fetch(API_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!authResponse.ok) {
        const authData = await authResponse.json();
        const errMsg = authData.detail || JSON.stringify(authData);
        setError(`Ошибка логина после регистрации: ${errMsg}`);
        return;
      }

      const authData = await authResponse.json();
      if (authData.token) {
        onRegister(authData.token);
      } else {
        setError('Не удалось получить токен авторизации после логина');
      }

    } catch (error) {
      setError(`Ошибка сети: ${error.message}`);
    }
  }

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        /><br />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}

export default RegisterPage;