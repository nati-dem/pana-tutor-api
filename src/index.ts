import express, {Application} from 'express';
const morgan = require('morgan');
import {indexRouter} from './routes/index';
import {usersRouter} from './routes/users';
import {accessLogStream} from './config/logger-config';

const app:Application = express();

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

app.listen(5000, ()=>{
  console.log('server runnning')
})
