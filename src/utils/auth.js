const jwt = require("jsonwebtoken");
// const config = require('./config');
const bcrypt = require("bcryptjs");
const expiration = "2h";
const encryptPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
        return false;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
          return false;
        }
        resolve(hash);
        return true;
      });
    });
  });

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: 604800 }
  );
};

const getUserId = (req, authToken) => {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
};

const getToken = (payload) => {
  const token = jwt.sign(payload, config.secret, {
    expiresIn: 604800, // 1 Week
  });
  return token;
};

const getPayload = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { loggedIn: true, payload };
  } catch (err) {
    return { loggedIn: false };
  }
};

module.exports = {
  encryptPassword,
  generateToken,
  getPayload,
  getUserId,
  getToken,
};
