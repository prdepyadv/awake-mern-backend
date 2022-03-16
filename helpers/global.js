require("dotenv").config();
const jwt = require('jsonwebtoken');

let generateAccessToken = function (user) {
    return jwt.sign(
        { _id: user._id.toString() },
         process.env.TOKEN_SECRET,
        { expiresIn: (process.env.TOKEN_EXPIRY_IN_SECS ?? 1800)+'s' }
        );
}
let authenticateToken = function (req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.send({'error': true, 'message': 'Unauthorized request'})
  jwt.verify(token.toString(), process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.send({'error': true, 'message': 'Invalid token'})
    req.user = user
    next()
  })
}

exports.generateAccessToken = generateAccessToken;
exports.authenticateToken = authenticateToken;