import express, {Application} from 'express';
import {indexRouter} from './router/index';
import {usersRouter} from './router/users';
import {authRouter} from './router/auth';
import {rotatingAccessLogStream} from './config/logger-config';
import axios from "axios";
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
  res.setHeader("Content-Type", "application/json");
  next();
});

axios.defaults.baseURL = process.env.BASE_API_URL;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  // next(createError(404));
  res.status(404);
  res.send( "Not Found!" );
});

app.use((err, req, res, next) => {
  err.httpStatus = err.httpStatus || 500;

  res.status(err.httpStatus)
    .json({
       code: err.code,
       message: err.message,
       detail: err.detail ? err.detail : ''
    });
});

app.listen(5000, ()=>{
  console.log('server runnning');
})

