/**
 * server/tests/auth.test.js
 * Тесты аутентификации: регистрация и вход
 *
 * Запуск: npm test (из папки server/)
 */

const request = require('supertest');
const app = require('../src/index'); // экспортируй app из index.js (см. README)

// Уникальный email для каждого запуска тестов
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

describe('Auth API — /api/auth', () => {

  // ─── Регистрация ───────────────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {

    it('успешная регистрация нового пользователя', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('ошибка при регистрации с уже существующим email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

      expect(res.statusCode).toBe(409); // Conflict
    });

    it('ошибка при отсутствии email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: TEST_PASSWORD });

      expect(res.statusCode).toBe(400);
    });

    it('ошибка при отсутствии пароля', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'another@example.com' });

      expect(res.statusCode).toBe(400);
    });

    it('ошибка при пустом теле запроса', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── Вход ──────────────────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {

    it('успешный вход с корректными данными', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('ошибка при неверном пароле', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: 'WrongPassword!' });

      expect(res.statusCode).toBe(401);
    });

    it('ошибка при несуществующем email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notexist@example.com', password: TEST_PASSWORD });

      expect(res.statusCode).toBe(401);
    });

    it('ошибка при пустом теле запроса', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── Защищённый маршрут ────────────────────────────────────────────────────

  describe('GET /api/protected', () => {

    it('доступ с валидным токеном', async () => {
      // Сначала логинимся и получаем токен
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it('отказ без токена', async () => {
      const res = await request(app)
        .get('/api/protected');

      expect(res.statusCode).toBe(401);
    });

    it('отказ с неверным токеном', async () => {
      const res = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.statusCode).toBe(401);
    });
  });
});
