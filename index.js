require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();

const path = require('path')
// let {courses} = require('./data/courses')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const httpStatusText = require('./utilts/httpStatusText')


const mongoose = require('mongoose');
const url = process.env.MONGO_URL

// console.log('process', process.env)

mongoose.connect(url)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.use(cors())
app.use(express.json()) //it make api take data from post as json
// app.use(bodyParser.json())

const coursesRouter = require('./routes/courses.routes');
const usersRouter = require('./routes/users.routes');


app.use('/api/courses', coursesRouter)
app.use('/api/users', usersRouter)

//overWrite if i wirte url wrong 
// global middleware for not found router
app.all('*', (req, res, next) => {
  return res.status(404).json({ status: error.httpStatusText || httpStatusText.ERROR, message: error.message || 'this resource is not avalible', code: error.statusCode || 500, data: null })
})

// global error handler
app.use((error, req, res, next) => {
  // res.json(error)

  res.status(error.statusCode || 500).json({ status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null })
})



const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})