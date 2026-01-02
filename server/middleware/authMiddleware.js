const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get header
  const authHeader = req.header('Authorization');
  
  // 2. Check if it exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  // 3. Extract the token part
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = authMiddleware;