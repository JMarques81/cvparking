// backend/models/Sensor.js
const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
  id_sensor: String,
  estado: { type: String, enum: ['livre', 'ocupado'], default: 'livre' },
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Sensor || mongoose.model('Sensor', SensorSchema);

