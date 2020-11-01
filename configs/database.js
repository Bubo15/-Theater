require('dotenv').config()

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) { console.log(err) }
    console.log('Successfuly connected to DB')
})