const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.assigned_role)) {
    return res.status(403).json({ message: 'Access Denied' });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };