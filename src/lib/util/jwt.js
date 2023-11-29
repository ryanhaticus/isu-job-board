import jwt from 'jsonwebtoken';

export const getUserIdFromToken = (req) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return null;
  }

  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      return decoded.userId;
    }

    return null;
  });
};
