import {Application} from 'express';
import {RouteConfig} from './config/route-config';
require('dotenv').config();

const app:Application = new RouteConfig().app;

app.listen(5000, ()=>{
  console.log('server runnning');
})
