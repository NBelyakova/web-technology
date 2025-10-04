# Project Uni - Django + React Blog Application

Веб-приложение для создания и управления постами с аутентификацией пользователей.

## 🛠️ Технологии

- **Backend**: Django 5.2.6 + Django REST Framework
- **Frontend**: React 18
- **База данных**: SQLite
- **Аутентификация**: Token Authentication

## 🚀 Запуск проекта

### Backend (Django)

#### Активация виртуального окружения
`venv\Scripts\activate  # Windows`

`source venv/bin/activate  # Mac/Linux`

#### Установка зависимостей
`pip install -r requirements.txt`

#### Миграции базы данных
`python manage.py migrate`

#### Запуск сервера
`python manage.py runserver`

Сервер доступен по адресу: http://localhost:8000

### Frontend (React)

`cd client`

#### Установка зависимостей
`npm install`

#### Запуск клиента
`npm start`

Клиент доступен по адресу: http://localhost:3000

## API Endpoints

### Регистрация пользователя
- Метод: `POST`
- URL: `/register/`
- Тело запроса:
```json
{
  "username": "string",
  "password": "string"
}
```
- Успешный ответ: `201 Created`
- Ошибки: `400 Bad Request (неверные данные)`

### Авторизация пользователя
- Метод: `POST`
- URL: `/auth/`
- Тело запроса:

```json
{
  "username": "string", 
  "password": "string"
}
```
Успешный ответ: `200 OK`

```json
{
  "token": "string"
}
```
Ошибки: `400 Bad Request (неверный логин/пароль)`

### Получение данных текущего пользователя
- Метод: `GET`
- URL: `/users/me/`
- Заголовки: Authorization: Token <your_token>
- Успешный ответ: `200 OK`

```json
{
  "id": "number",
  "username": "string",
  "email": "string"
}
```
Ошибки: `401 Unauthorized (неверный/отсутствующий токен)`

### Посты
### Получить все посты
- Метод: `GET`
- URL: `/posts/`
- Заголовки: Authorization: Token <your_token> (опционально для неавторизованного просмотра)
- Успешный ответ: `200 OK`

```json
[
  {
    "id": "number",
    "author": "number",
    "author_username": "string", 
    "text": "string",
    "created_at": "string"
  }
]
```

### Создать пост
- Метод: `POST`
- URL: `/posts/`
  
Заголовки:
- Authorization: Token <your_token>
- Content-Type: application/json
  
Тело запроса:
```json
{
  "text": "string"
}
```
- Успешный ответ: `201 Created`
  
Ошибки:
- `401 Unauthorized (неавторизованный доступ)`
- `400 Bad Request (неверные данные)`
  
### Редактировать пост
- Метод: `PUT`
- URL: `/posts/{id}/`
  
Заголовки:
- Authorization: Token <your_token>
- Content-Type: application/json

Тело запроса:
```json
{
  "text": "string"
}
```
Успешный ответ: `200 OK`

Ошибки:
- `401 Unauthorized (неавторизованный доступ)`
- `403 Forbidden (попытка редактировать чужой пост)`
- `404 Not Found (пост не существует)`

### Удалить пост
- Метод: `DELETE`
- URL: `/posts/{id}/`
- Заголовки: Authorization: Token <your_token>
- Успешный ответ: `204 No Content`

Ошибки:
- `401 Unauthorized (неавторизованный доступ)`
- `403 Forbidden (попытка удалить чужой пост)`
- `404 Not Found (пост не существует)`

