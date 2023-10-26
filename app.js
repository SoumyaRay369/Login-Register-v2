const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();
const PORT = 3000 || process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(err);
});

// Define a schema for the user data
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Define a model for the user data
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Save the user data to MongoDB
    const user = new User({ username, password });
    user.save().then(() => {
        res.send('Login successful');
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if the user exists in MongoDB
    User.findOne({ username, password }).then((user) => {
        if (user) {
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(PORT, () => {
    console.log('Listening on port 3000')
})