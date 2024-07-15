const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require('../models/user.models')
const httpStatusText = require('../utilts/httpStatusText')
const appError = require('../utilts/appError')
const generateJWT = require('../utilts/genarateJWT'); // Typo: should be 'generateJWT'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getAllUsers = asyncWrapper(async (req, res) => {
  console.log(req.headers)
  const query = req.query;

  console.log(query)
  let limit = query.limit || 10;
  let page = query.page || 1;
  const skip = (page - 1) * limit;
  // i want __v don't show
  const users = await User.find({}, { "__v": false, 'password': false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } })
})

const register = asyncWrapper(async (req, res, next) => {
  // console.log(req.body.firstName)
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email })
  if (oldUser) {
    const error = appError.create('user already exists', 400, httpStatusText.FAIL)
    return next(error)
  }
  // password hashing
  const hashedPassword = await bcrypt.hash(password, 1)
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  })
  // genarate JWT token
  // const token = await jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECERT_KEY, { expiresIn: '1m' })

  const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role });
  newUser.token = token;


  await newUser.save();

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
})

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body)
  if (!email && !password) {
    const error = appError.create('email and password are required', 400, httpStatusText.FAIL);
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create('user not found', 400, httpStatusText.FAIL);
    return next(error)
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    // logged in successfully

    const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
    return res.json({ status: httpStatusText.SUCCESS, data: { token } })
  } else {
    const error = appError.create('something wrong', 500, httpStatusText.FAIL)
    return next(error)
  }

})

module.exports = {
  getAllUsers,
  register,
  login
}