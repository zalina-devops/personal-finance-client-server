const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction
} = require("../controllers/transactionController");

router.post("/", authMiddleware, addTransaction);

router.get("/", authMiddleware, getTransactions);

router.delete("/:id", authMiddleware, deleteTransaction);

router.put("/:id", authMiddleware, updateTransaction);

module.exports = router;