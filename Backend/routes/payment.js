const express = require('express');
const axios = require('axios');
const getToken = require('../middleware/getToken');
const generatePassword = require('../utils/generatePassword');
const { paymentStatusStore } = require('../utils/store');

const router = express.Router();

router.post('/pay', getToken, async (req, res) => {
  const { phone, amount } = req.body;
  if (!phone || !amount) return res.status(400).json({ error: 'Phone and amount required' });

  const { timestamp, password } = generatePassword();

  try {
    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
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
    }, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        'Content-Type': 'application/json'
      }
    });

    paymentStatusStore[response.data.CheckoutRequestID] = { status: 'pending' };
    res.json({ message: 'STK Push initiated', CheckoutRequestID: response.data.CheckoutRequestID });
  } catch (error) {
    console.error('STK Push error:', error.message);
    res.status(500).json({ error: 'STK Push failed' });
  }
});

router.post('/callback', (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;

    if (callbackData.ResultCode === 0) {
      const metadata = Object.fromEntries(callbackData.CallbackMetadata.Item.map(item => [item.Name, item.Value]));
      paymentStatusStore[checkoutRequestId] = {
        status: 'success',
        ...metadata
      };
    } else {
      paymentStatusStore[checkoutRequestId] = { status: 'failed', reason: callbackData.ResultDesc };
    }

    res.json({ message: 'Callback handled' });
  } catch (err) {
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

router.get('/status/:checkoutRequestId', (req, res) => {
  const status = paymentStatusStore[req.params.checkoutRequestId];
  if (!status) return res.status(404).json({ status: 'unknown' });
  res.json(status);
});

module.exports = router;
