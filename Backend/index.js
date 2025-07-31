require('dotenv').config();
console.log('CONSUMER_KEY:', process.env.CONSUMER_KEY);
console.log('SECRET:', process.env.CONSUMER_SECRET);
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-kiosk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  phone: { type: String, required: true },
  receipt: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

const paymentStatusStore = {};

// Middleware to get OAuth token
const getToken = async (req, res, next) => {
  try {
    if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET) {
      throw new Error('Missing CONSUMER_KEY or SECRET in environment variables');
    }

    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
    console.log('Attempting to get token with auth:', auth);
    
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    if (!response.data.access_token) {
      throw new Error('No access token received in response');
    }
    
    req.token = response.data.access_token;
    next();
  } catch (error) {
    console.error('Token generation failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ 
      error: 'Failed to generate token',
      details: error.message,
      response: error.response?.data
    });
  }
};

// Generate timestamp and password
const generatePassword = () => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${process.env.PAYBILL}${process.env.PASSKEY}${timestamp}`).toString('base64');
  return { timestamp, password };
};

// STK Push endpoint
app.post('/pay', getToken, async (req, res) => {
  console.log(req.body)
  try {
    const { phone, amount } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount are required' });
    }

    const { timestamp, password } = generatePassword();
    
    const stkPushData = {
      BusinessShortCode: process.env.PAYBILL,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.PAYBILL,
      PhoneNumber: phone,
      CallBackURL: `https://1661ed185f92.ngrok-free.app/callback`,
      AccountReference: "Test",
      TransactionDesc: "Payment"
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushData,
      {
        headers: {
          'Authorization': `Bearer ${req.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Store initial status as pending
    paymentStatusStore[response.data.CheckoutRequestID] = { status: 'pending' };

    res.json({
      message: 'STK Push initiated successfully',
      CheckoutRequestID: response.data.CheckoutRequestID
    });
  } catch (error) {
    console.error('STK Push failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate STK Push', details: error.response?.data || error.message });
  }
});

// Callback endpoint
app.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    console.log('Callback received:', callbackData);

    const checkoutRequestId = callbackData.CheckoutRequestID;
    if (callbackData.ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata.Item.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      // Update status to success
      paymentStatusStore[checkoutRequestId] = {
        status: 'success',
        amount: metadata.Amount,
        phone: metadata.PhoneNumber,
        receipt: metadata.MpesaReceiptNumber
      };

      // Store order in MongoDB
      const order = new Order({
        username: null, // Will be set if user is logged in
        amount: metadata.Amount,
        phone: metadata.PhoneNumber,
        receipt: metadata.MpesaReceiptNumber,
        time: new Date()
      });
      await order.save();

      console.log('Payment successful:', {
        amount: metadata.Amount,
        phone: metadata.PhoneNumber,
        receipt: metadata.MpesaReceiptNumber
      });
    } else {
      // Update status to failed
      paymentStatusStore[checkoutRequestId] = {
        status: 'failed',
        reason: callbackData.ResultDesc
      };
      console.log('Payment failed:', callbackData.ResultDesc);
    }

    res.json({ message: 'Callback received and logged' });
  } catch (error) {
    console.error('Callback processing failed:', error.message);
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

// Payment status polling endpoint
app.get('/status/:checkoutRequestId', (req, res) => {
  const status = paymentStatusStore[req.params.checkoutRequestId];
  if (!status) return res.status(404).json({ status: 'unknown' });
  res.json(status);
});

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });
    
    const hashed = await bcrypt.hash(password, 10);
    const isAdmin = username === 'admin'; // First user with username 'admin' becomes admin
    
    const user = new User({ username, password: hashed, isAdmin });
    await user.save();
    
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin middleware
function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Get user orders
app.get('/orders', authMiddleware, async (req, res) => {
  try {
    const userOrders = await Order.find({ username: req.user.username }).sort({ time: -1 });
    res.json(userOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Get all orders
app.get('/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const allOrders = await Order.find().sort({ time: -1 });
    res.json(allOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Delete order
app.delete('/admin/orders/:receipt', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ receipt: req.params.receipt });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'coffee-kiosk-backend'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
