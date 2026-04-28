# MyFinance — Personal Finance Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![Backend Tests](https://img.shields.io/badge/backend%20tests-29%20passed-brightgreen?style=flat-square&logo=jest)
![Frontend Tests](https://img.shields.io/badge/frontend%20tests-17%20passed-brightgreen?style=flat-square&logo=testing-library)

> **MyFinance** — полноценное клиент-серверное приложение для учёта личных финансов. Позволяет добавлять доходы и расходы, просматривать статистику в виде графиков, фильтровать транзакции и переключать тёмную тему. Проект демонстрирует навыки работы с современным fullstack-стеком.

🔗 **[Демо на GitHub Pages](https://zalina-devops.github.io/personal-finance-client-server)**
> В демо-режиме используются моковые данные — изменения не сохраняются.

---

## 📸 Скриншоты

| Светлая тема | Тёмная тема |
|---|---|
| ![Светлая тема](screenshots/dashboard-light.png) | ![Тёмная тема](screenshots/dashboard-dark.png) |

| Добавление транзакции | Таблица с фильтрами |
|---|---|
| ![Add transaction](screenshots/add-transaction.png) | ![Transaction table](screenshots/transaction-table.png) |

---

## ✨ Функциональность

### 🖥 Клиентская часть (Frontend)
- ✅ Регистрация и авторизация пользователей (JWT)
- ✅ Добавление, редактирование и удаление транзакций (доходы/расходы)
- ✅ Фильтрация по типу и категории
- ✅ Визуализация расходов — круговая диаграмма и график по месяцам
- ✅ Валидация форм
- ✅ Тёмная тема (Context API + CSS-переменные)
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Пагинация в таблице транзакций
- ✅ Демо-режим с моковыми данными (GitHub Pages)

### ⚙️ Серверная часть (Backend)
- ✅ REST API на Express.js
- ✅ Аутентификация через JWT (bcrypt для хеширования паролей)
- ✅ PostgreSQL — таблицы `users`, `transactions`
- ✅ Подготовленные SQL-запросы (без ORM)
- ✅ Rate limiting, CORS, Helmet для безопасности
- ✅ Docker-контейнеризация (бэкенд + БД)

### 🧪 Тестирование
- ✅ **29 тестов бэкенда** — Jest + Supertest
  - `auth.test.js` (11 тестов) — регистрация, вход, JWT, защищённые роуты
  - `transactions.test.js` (18 тестов) — полный CRUD, валидация, фильтрация
- ✅ **17 тестов фронтенда** — Jest + React Testing Library
  - `Login.test.jsx` (6 тестов) — форма входа, валидация, мок API
  - `SummaryCards.test.jsx` (6 тестов) — подсчёт доходов и расходов
  - `ThemeContext.test.jsx` (5 тестов) — переключение темы, провайдер

---

## 🛠 Технологии

### Frontend
| Технология | Назначение |
|---|---|
| React + Vite | UI и сборка |
| React Router | Навигация |
| Recharts | Графики и диаграммы |
| Axios | HTTP-запросы |
| React Context | Глобальное состояние темы |
| CSS Variables + Flexbox/Grid | Стилизация |

### Backend
| Технология | Назначение |
|---|---|
| Node.js + Express | Сервер и REST API |
| PostgreSQL | База данных |
| jsonwebtoken | JWT-аутентификация |
| bcrypt | Хеширование паролей |
| pg | Драйвер PostgreSQL |
| express-rate-limit | Защита от брутфорса |
| helmet + cors | Безопасность |

### Инфраструктура и тестирование
| Технология | Назначение |
|---|---|
| Docker + Docker Compose | Контейнеризация |
| Jest + Supertest | Тестирование бэкенда (29 тестов) |
| Jest + React Testing Library | Тестирование фронтенда (17 тестов) |
| GitHub Pages | Хостинг демо-версии |
| Git | Контроль версий |

---

## 🚀 Запуск проекта

### Предварительные требования
- [Node.js](https://nodejs.org/) v16+
- [Docker](https://www.docker.com/) и Docker Compose (для запуска через Docker)

---

### Вариант 1 — Локальный запуск (без Docker)

Этот способ подходит если Docker не установлен. Потребуется локальная PostgreSQL.

**1. Клонируй репозиторий**
```bash
git clone https://github.com/zalina-devops/personal-finance-client-server.git
cd personal-finance-client-server
```

**2. Настрой переменные окружения бэкенда**

Создай файл `.env` в папке `server/`:
```env
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=personal_finance_db
JWT_SECRET=supersecretkey
```

**3. Создай базу данных и таблицы**

Подключись к PostgreSQL и выполни:
```sql
CREATE DATABASE personal_finance_db;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**4. Запусти бэкенд**

Открой первый терминал в папке `server/`:
```bash
cd server
npm install
node src/index.js
```
Бэкенд будет доступен на `http://localhost:5000`

**5. Запусти фронтенд**

Открой второй терминал в папке `client/`:
```bash
cd client
npm install
npm run dev
```
Фронтенд откроется на `http://localhost:5173`

---

### Вариант 2 — Запуск через Docker (рекомендуется)

Одна команда поднимает бэкенд и базу данных в контейнерах.

**1. Клонируй репозиторий**
```bash
git clone https://github.com/zalina-devops/personal-finance-client-server.git
cd personal-finance-client-server
```

**2. Создай `.env` файл в папке `server/`** (см. шаг 2 выше)

**3. Запусти Docker**
```bash
docker-compose up --build
```

- PostgreSQL будет доступен на порту `5432`
- Бэкенд API — на `http://localhost:5000`

**4. Запусти фронтенд** (в отдельном терминале)
```bash
cd client
npm install
npm run dev
```

Фронтенд откроется на `http://localhost:5173`

---

## 🧪 Запуск тестов

### Бэкенд (29 тестов)
```bash
cd server
npm test
```

### Фронтенд (17 тестов)
```bash
cd client
npm test
```

---

## 🔌 API Endpoints

| Метод | URL | Описание | Авторизация |
|---|---|---|---|
| POST | `/api/auth/register` | Регистрация | — |
| POST | `/api/auth/login` | Вход | — |
| GET | `/api/protected` | Проверка токена | ✅ Bearer |
| GET | `/api/transactions` | Получить транзакции | ✅ Bearer |
| POST | `/api/transactions` | Создать транзакцию | ✅ Bearer |
| PUT | `/api/transactions/:id` | Обновить транзакцию | ✅ Bearer |
| DELETE | `/api/transactions/:id` | Удалить транзакцию | ✅ Bearer |

**Query-параметры для GET /api/transactions:**
- `type` — фильтр по типу (`income` / `expense`)
- `category` — фильтр по категории
- `search` — поиск по категории

---

## 📁 Структура проекта

```
personal-finance-client-server/
├── docker-compose.yml
├── README.md
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/                     # HTTP-запросы и мок-данные
│   │   ├── context/ThemeContext.jsx  # Глобальное состояние темы
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard/           # SummaryCards, Charts, Table
│   │   └── components/ProtectedRoute.jsx
│   ├── src/__tests__/               # Тесты фронтенда (17 тестов)
│   │   ├── Login.test.jsx
│   │   ├── SummaryCards.test.jsx
│   │   └── ThemeContext.test.jsx
│   └── package.json
└── server/                          # Backend (Node.js + Express)
    ├── src/
    │   ├── config/db.js             # Подключение к PostgreSQL
    │   ├── controllers/             # authController, transactionController
    │   ├── middleware/              # authMiddleware, errorMiddleware
    │   ├── models/                  # Модели данных
    │   ├── routes/                  # authRoutes, transactionRoutes
    │   └── index.js                 # Точка входа
    ├── tests/                       # Тесты бэкенда (29 тестов)
    │   ├── auth.test.js             # 11 тестов аутентификации
    │   └── transactions.test.js     # 18 тестов CRUD транзакций
    └── package.json
```

---

## 📌 Планы по развитию

- [ ] Экспорт транзакций в CSV/Excel
- [ ] Страница расширенной статистики
- [ ] Редактирование категорий
- [ ] Деплой бэкенда на Render/Railway для полноценной демо-версии

---

## 👩‍💻 Автор

**Залина Алискерова** — студентка 3 курса, специальность 09.02.07 «Информационные системы и программирование»

[![GitHub](https://img.shields.io/badge/GitHub-zalina--devops-181717?style=flat&logo=github)](https://github.com/zalina-devops)

---

⭐ Если проект понравился — поставь звёздочку на GitHub!
