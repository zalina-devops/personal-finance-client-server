/**
 * server/tests/transactions.test.js
 * Тесты CRUD для транзакций
 *
 * Запуск: npm test (из папки server/)
 */

const request = require('supertest');
const app = require('../src/index');

// Токен получаем один раз перед всеми тестами
let authToken = '';
let createdTransactionId = null;

const TEST_EMAIL = `txn_test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

// ─── Подготовка: регистрируемся и получаем токен ──────────────────────────

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

  authToken = res.body.token;
});

// ─── Тесты транзакций ─────────────────────────────────────────────────────

describe('Transactions API — /api/transactions', () => {

  // ─── GET: получить все транзакции ─────────────────────────────────────────

  describe('GET /api/transactions', () => {

    it('возвращает пустой список для нового пользователя', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('отказ без авторизации', async () => {
      const res = await request(app)
        .get('/api/transactions');

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── POST: создать транзакцию ─────────────────────────────────────────────

  describe('POST /api/transactions', () => {

    it('успешное создание транзакции-расхода', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'expense', amount: 1500, category: 'Еда' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.type).toBe('expense');
      expect(Number(res.body.amount)).toBe(1500);
      expect(res.body.category).toBe('Еда');

      // Сохраняем id для последующих тестов
      createdTransactionId = res.body.id;
    });

    it('успешное создание транзакции-дохода', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'income', amount: 50000, category: 'Зарплата' });

      expect(res.statusCode).toBe(201);
      expect(res.body.type).toBe('income');
    });

    it('ошибка при сумме 0', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'expense', amount: 0, category: 'Еда' });

      expect(res.statusCode).toBe(400);
    });

    it('ошибка при отрицательной сумме', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'expense', amount: -100, category: 'Еда' });

      expect(res.statusCode).toBe(400);
    });

    it('ошибка при пустой категории', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'expense', amount: 100, category: '' });

      expect(res.statusCode).toBe(400);
    });

    it('ошибка при неверном типе транзакции', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'unknown', amount: 100, category: 'Тест' });

      expect(res.statusCode).toBe(400);
    });

    it('ошибка без авторизации', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .send({ type: 'expense', amount: 100, category: 'Тест' });

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── PUT: обновить транзакцию ─────────────────────────────────────────────

  describe('PUT /api/transactions/:id', () => {

    it('успешное обновление транзакции', async () => {
      expect(createdTransactionId).not.toBeNull();

      const res = await request(app)
        .put(`/api/transactions/${createdTransactionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'expense', amount: 2000, category: 'Транспорт' });

      expect(res.statusCode).toBe(200);
      expect(Number(res.body.amount)).toBe(2000);
      expect(res.body.category).toBe('Транспорт');
    });

    it('ошибка при обновлении несуществующей транзакции', async () => {
      const res = await request(app)
        .put('/api/transactions/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'expense', amount: 100, category: 'Тест' });

      expect(res.statusCode).toBe(404);
    });

    it('ошибка без авторизации', async () => {
      const res = await request(app)
        .put(`/api/transactions/${createdTransactionId}`)
        .send({ type: 'expense', amount: 100, category: 'Тест' });

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── DELETE: удалить транзакцию ───────────────────────────────────────────

  describe('DELETE /api/transactions/:id', () => {

    it('успешное удаление транзакции', async () => {
      expect(createdTransactionId).not.toBeNull();

      const res = await request(app)
        .delete(`/api/transactions/${createdTransactionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('ошибка при удалении уже удалённой транзакции', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${createdTransactionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('ошибка без авторизации', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${createdTransactionId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── Фильтрация ───────────────────────────────────────────────────────────

  describe('GET /api/transactions?type=...', () => {

    it('фильтрация по типу expense', async () => {
      const res = await request(app)
        .get('/api/transactions?type=expense')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      res.body.forEach(t => expect(t.type).toBe('expense'));
    });

    it('фильтрация по типу income', async () => {
      const res = await request(app)
        .get('/api/transactions?type=income')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      res.body.forEach(t => expect(t.type).toBe('income'));
    });
  });
});
