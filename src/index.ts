import {Application} from 'express';
import {ExpressConfig} from './config/express-config';
require('dotenv').config();

const app:Application = new ExpressConfig().app;

app.listen(5000, ()=>{
  console.log('server runnning');
})
