const jwt = require('jsonwebtoken')
const httpStatusText = require('../utilts/httpStatusText')
const appError = require('../utilts/appError')


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json('token is required')
  }
  const token = authHeader.split(' ')[1]
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECERT_KEY);
    // console.log("currentUser", currentUser)
    req.currentUser = currentUser
    next();
  } catch (err) {
    const error = appError.create('invalid token', 401, httpStatusText.FAIL);
    return next(error)
  }
}
module.exports = verifyToken