import express = require('express');
const router = express.Router();

export const usersRouter = router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

