const express = require('express');
const {login, signup, logout, getUserByGoogleId} = require('./auth.controller');

const router = express.Router();

router.get('/:googleId', getUserByGoogleId);
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

module.exports = router;
