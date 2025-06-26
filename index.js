const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connection = require('./lib/connection');
const admins = require('./routes/adminRouter');
const faculty = require('./routes/facultyRouter');
const students = require('./routes/studentRouter');
const cors = require('cors');
cors
dotenv.config();
connection.sync();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use('/api/v1/admin/', admins);
app.use('/api/v1/faculty/', faculty);
app.use('/api/v1/student/', students);
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})



