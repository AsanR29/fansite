const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var flash = require('express-flash')

var homeRouter = require('./routes/home');
var balmoraRouter = require('./routes/balmora');
var tableRouter = require('./routes/table_class');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'large guar'
}))
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')))


app.use('/', homeRouter);
app.use('/balmora', balmoraRouter);

const server = app.listen(3002, () => {
    console.log(`The application started on port ${server.address().port}`);
});

module.exports = app;