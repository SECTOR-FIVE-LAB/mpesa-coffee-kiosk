const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware'); // ✅ fix

const { orders } = require('../utils/store');

const router = express.Router();

router.get('/orders', authMiddleware, (req, res) => {
  const userOrders = orders.filter(order => order.username === req.user.username);
  res.json(userOrders);
});

router.get('/allorders', adminOnly, (req, res) => {
  res.json(orders);
});

// Assuming orders is a DB model for these routes:
router.delete('/orders/:id', adminOnly, async (req, res) => {
  await orders.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order deleted' });
});

router.patch('/orders/:id/fulfill', adminOnly, async (req, res) => {
  const order = await orders.findByIdAndUpdate(req.params.id, { fulfilled: true }, { new: true });
  res.json(order);
});

module.exports = router;
