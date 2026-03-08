const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/balance', transactionController.getBalance);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;