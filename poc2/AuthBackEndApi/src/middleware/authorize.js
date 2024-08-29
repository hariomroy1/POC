const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  if (!Array.isArray(roles)) {
    roles = [roles]; 
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the decoded role includes 'admin' or 'user'
      if (roles.length && !roles.some(role => decoded.RoleName.includes(role))) {
        return res.status(403).json({ message: 'Access Denied: You do not have correct privilege to perform this operation' });
      }

      // Attach the decoded user details to the request for further use
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).json({ message: 'Invalid Token' });
    }
  };
};

module.exports = authorize;
