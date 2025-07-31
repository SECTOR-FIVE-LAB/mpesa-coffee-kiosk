module.exports = function generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.PAYBILL}${process.env.PASSKEY}${timestamp}`).toString('base64');
    return { timestamp, password };
  };
  