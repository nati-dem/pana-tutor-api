import express = require('express');
const router = express.Router();

// define a route handler for the default home page
export const indexRouter = router.get( "/", ( req, res ) => {
  res.send( "Hello world!" );
} );
