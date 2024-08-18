const exprese = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

const app = exprese();
dotenv.config();

app.use(exprese.json());

// database connection
mongoose
    .connect('mongodb://localhost:27017/todos')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// application routes
app.get('/', (req, res) => {
    res.send('Hello Programmer');
});
app.use('/todo', todoHandler);
app.use('/user', userHandler);

const errorHandler = (err, req, res, next) => {
    if (res.headersSend) {
        return next(err);
    }
    res.status(500).json({ error: err });
};
app.use(errorHandler);
app.listen(3000, () => {
    console.log('app listenig at port 3000');
});
