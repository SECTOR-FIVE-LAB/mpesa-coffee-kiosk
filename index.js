require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Constants
const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// OAuth token middleware
const getOAuthToken = async (req, res, next) => {
  try {
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
    
    const { data } = await axios.get(MPESA_AUTH_URL, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    req.token = data.access_token;
    next();
  } catch (error) {
    console.error('OAuth Token Error:', error.message);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
};

// Generate password function
const generatePassword = (timestamp) => {
  const passString = `${process.env.PAYBILL}${process.env.PASSKEY}${timestamp}`;
  return Buffer.from(passString).toString('base64');
};

// Payment initiation endpoint
app.post('/pay', getOAuthToken, async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount are required' });
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = generatePassword(timestamp);

    const stkPayload = {
      BusinessShortCode: process.env.PAYBILL,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.PAYBILL,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: 'Test',
      TransactionDesc: 'Test Payment'
    };

    const { data } = await axios.post(MPESA_STK_URL, stkPayload, {
      headers: {
        'Authorization': `Bearer ${req.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('STK Push Response:', data);
    res.json(data);

  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Payment initiation failed',
      details: error.response?.data || error.message
    });
  }
});

// Callback endpoint
app.post('/callback', (req, res) => {
  try {
    const { Body } = req.body;
    
    if (Body.stkCallback.ResultCode === 0) {
      const metadata = Body.stkCallback.CallbackMetadata.Item;
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const receipt = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const phone = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      console.log(`Payment received: ${amount} from ${phone}, Receipt: ${receipt}`);
    } else {
      console.log('Payment failed:', Body.stkCallback.ResultDesc);
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Callback Error:', error.message);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Important: Set up your .env file with the required credentials');
  console.log('For testing: Use ngrok to expose your callback URL');
}); 