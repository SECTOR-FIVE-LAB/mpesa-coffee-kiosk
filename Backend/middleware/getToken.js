const axios = require('axios');

module.exports = async function getToken(req, res, next) {
  try {
    const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;
    if (!CONSUMER_KEY || !CONSUMER_SECRET) throw new Error('Missing credentials');

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });

    req.token = response.data.access_token;
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    res.status(500).json({ error: 'Failed to get token', details: error.message });
  }
};
