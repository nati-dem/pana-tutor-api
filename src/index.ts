import express, {Application} from 'express';
import {indexRouter} from './router/index';
import {usersRouter} from './router/users';
import {rotatingAccessLogStream} from './config/logger-config';
const morgan =  require('morgan');
require('dotenv').config();

const app:Application = express();

app.use(morgan('combined', { stream: rotatingAccessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  // next(createError(404));
  res.status(404);
  res.send( "Not Found!" );
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    code: err.code,
    message: err.message
  });
});

app.listen(5000, ()=>{
  console.log('server runnning');
})

