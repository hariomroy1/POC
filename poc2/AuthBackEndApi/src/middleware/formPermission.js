const jwt = require('jsonwebtoken');

const rolePermissions = {
  superadmin: ['get', 'put', 'delete', 'create'],
  admin: ['get', 'put', 'create'],
  user: ['get'],
  other: ['get']
};

const authenticateAndAuthorize = (actions = []) => {
  if (!Array.isArray(actions)) {
    actions = [actions]; 
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
      console.log("decoded tokens are: ",decoded)
      req.userRole = decoded.RoleName; // Attach the role to the request

      // Check if the role has permission for the required actions
      if (actions.length && !actions.some(action => rolePermissions[req.userRole].includes(action))) {
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

module.exports = authenticateAndAuthorize;
