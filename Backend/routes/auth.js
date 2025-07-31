const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('../utils/store');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const isAdmin = req.body.username === 'admin' ;
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed, isAdmin });
  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });

  const { isAdmin } = user; // get isAdmin from the stored user object

  const token = jwt.sign({ username, isAdmin }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
  console.log('Logging in user:', { username, isAdmin });
console.log('Generated token:', token);

});

module.exports = router;
