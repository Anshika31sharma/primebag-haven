const expres =require('express');
const app = expres();
const cookieParser = require('cookie-parser');
const path = require('path');
const db =require('./config/mongoose-connection')
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
app.use(expres.json());
app.use(expres.urlencoded({extended:true}));
app.use(cookieParser());
app.use(expres.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/owners', ownersRouter);
app.use('/products',productsRouter);
app.use('/users',usersRouter);

app.listen(3000)
