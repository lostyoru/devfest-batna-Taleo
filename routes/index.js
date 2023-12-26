const express = require('express');
const router = express.Router();

const auth = require('./auth');
const logout = require('./logout');
const refreshToken = require('./refreshToken');
const register = require('./register');

const userRoutes = require('./api/userRoutes');
const storyRoutes = require('./api/storyRoutes');

router.use('/auth', auth);
router.use('/logout', logout);
router.use('/refreshToken', refreshToken);
router.use('/register', register);

router.use('/users', userRoutes);
router.use('/stories', storyRoutes);

module.exports = router;