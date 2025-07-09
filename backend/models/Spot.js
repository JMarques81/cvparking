const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['livre', 'ocupado', 'reservado'],
    default: 'livre'
  },
  sensorId: {
    type: String,
    default: null
  },
  localizacao: {
    lat: { type: Number },
    lng: { type: Number }
  },
  zona: {
    type: String,
    default: 'A'
  },
  ultimaAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Spot || mongoose.model('Spot', SpotSchema);