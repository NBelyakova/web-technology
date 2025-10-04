import React, { useState, useEffect } from 'react';

function Dashboard({ user, onLogout, token }) {
  // хуки всегда вызываются в начале
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [content, setContent] = useState('');

  const API_URL = 'http://localhost:8000/posts/';  // <-- адрес API для постов

  useEffect(() => {
    if (!token) return;  // не запрашиваем посты без токена

    async function fetchPosts() {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) throw new Error('Ошибка загрузки постов');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        alert('Не удалось загрузить посты');
      }
    }

    fetchPosts();
  }, [token]);

// Добавление нового поста
async function addPost() {
  if (!content.trim()) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ text: content }), // ← ДОБАВЬТЕ { } вокруг text: content
    });
    if (!response.ok) throw new Error('Ошибка добавления поста');
    const savedPost = await response.json();
    setPosts([savedPost, ...posts]);
    setContent('');
  } catch (error) {
    console.error(error);
    alert('Не удалось добавить пост');
  }
}


  // Удаление поста
  async function deletePost(id) {
    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });
      if (!response.ok) throw new Error('Ошибка удаления поста');
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error(error);
      alert('Не удалось удалить пост');
    }
  }

  // Начать редактирование
  function startEdit(post) {
    setEditingPost(post);
    setContent(post.text); // post.content и еще пониже
  }

  // Сохранить изменения
  async function saveEdit() {
    if (!content.trim()) return;

    try {
      const response = await fetch(`${API_URL}${editingPost.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({text: content }),
      });
      if (!response.ok) throw new Error('Ошибка сохранения изменений');
      const updatedPost = await response.json();
      setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)));
      setEditingPost(null);
      setContent('');
    } catch (error) {
      console.error(error);
      alert('Не удалось сохранить изменения');
    }
  }

  // Отмена редактирования
  function cancelEdit() {
    setEditingPost(null);
    setContent('');
  }

  // Если user не пришёл — показываем индикатор загрузки
  if (!user) {
    return <p>Загрузка данных пользователя...</p>;
  }

  return (
    <div>
      <h2>Личный кабинет пользователя {user.username}</h2>
      <button onClick={onLogout}>Выйти</button>

      <div style={{ marginTop: '20px' }}>
        <h3>{editingPost ? 'Редактировать пост' : 'Добавить пост'}</h3>
        <textarea
          rows="4"
          value={content}
          onChange={e => setContent(e.target.value)}
        /><br />
        {editingPost ? (
          <>
            <button onClick={saveEdit}>Сохранить</button>
            <button onClick={cancelEdit}>Отмена</button>
          </>
        ) : (
          <button onClick={addPost}>Добавить</button>
        )}
      </div>

      <h3>Мои посты</h3>
      {posts.length === 0 && <p>Постов нет</p>}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <p>{post.text}</p> 
            {(post.author === user.id || post.author_username === user.username) && (
              <>
              <button onClick={() => startEdit(post)}>Редактировать</button>
              <button onClick={() => deletePost(post.id)}>Удалить</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;