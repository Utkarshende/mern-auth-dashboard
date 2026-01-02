const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Look for the Authorization header
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract the actual token string
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user ID (from token payload) in request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;