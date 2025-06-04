const express =require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const db =require('./config/mongoose-connection')
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const expressSession = require('express-session');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'myDevSecret123',
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');

app.use('/owners', ownersRouter);
app.use('/products',productsRouter);
app.use('/users',usersRouter);
app.use('/', indexRouter);

app.listen(3000)
