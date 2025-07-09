// backend/routes/sensores.js
const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

// Listar todos os sensores
router.get('/', async (req, res) => {
  const sensores = await Sensor.find();
  res.json(sensores);
});

// Criar novo sensor
router.post('/', async (req, res) => {
  const sensor = new Sensor(req.body);
  await sensor.save();
  res.json(sensor);
});

module.exports = router;
