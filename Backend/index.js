require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware to get OAuth token
const getToken = async (req, res, next) => {
  try {
    if (!process.env.CONSUMER_KEY || !process.env.SECRET) {
      throw new Error('Missing CONSUMER_KEY or SECRET in environment variables');
    }

    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.SECRET}`).toString('base64');
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
      CallBackURL: `https://f09a-102-213-49-19.ngrok-free.app/callback`,
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

    res.json({
      message: 'STK Push initiated successfully',
      CheckoutRequestID: response.data.CheckoutRequestID
    });
  } catch (error) {
    console.error('STK Push failed:', error.message);
    res.status(500).json({ error: 'Failed to initiate STK Push' });
  }
});

// Callback endpoint
app.post('/callback', (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    console.log('Callback received:', callbackData);

    if (callbackData.ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata.Item.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      console.log('Payment successful:', {
        amount: metadata.Amount,
        phone: metadata.PhoneNumber,
        receipt: metadata.MpesaReceiptNumber
      });
    } else {
      console.log('Payment failed:', callbackData.ResultDesc);
    }

    res.json({ message: 'Callback received and logged' });
  } catch (error) {
    console.error('Callback processing failed:', error.message);
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 