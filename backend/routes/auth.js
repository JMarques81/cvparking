const express = require('express');
const router = express.Router();
const { registar, login } = require('../controllers/authController');

// Registo
router.post('/registar', registar);

// Login
router.post('/login', login);

module.exports = router;