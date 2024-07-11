const express = require('express');
const app = express();
// let {courses} = require('./data/courses')

app.use(express.json()) //it make api take data from post as json
// app.use(bodyParser.json())

const coursesRouter = require('./routes/courses.routes');
app.use('/api/courses', coursesRouter)

const port = 5001
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})