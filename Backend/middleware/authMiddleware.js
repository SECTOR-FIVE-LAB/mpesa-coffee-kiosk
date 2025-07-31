const jwt = require('jsonwebtoken');
//const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

 function authMiddleware(req, res, next) {
  console.log('user', req.body)
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

function adminOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || !user.isAdmin) {
      console.log('Forbidden access:', user);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log('Verified user:', user);
    next();
  });
}


module.exports =  {adminOnly,authMiddleware};