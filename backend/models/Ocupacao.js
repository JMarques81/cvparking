const mongoose = require('mongoose');

const OcupacaoSchema = new mongoose.Schema({
  sensor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
    required: true
  },
  id_sensor: {
    type: String,
    required: true
  },
  utilizador_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  matricula: {
    type: String,
    required: false,
    default: null
  },
  inicio_ocupacao: {
    type: Date,
    required: true,
    default: Date.now
  },
  fim_ocupacao: {
    type: Date,
    required: false,
    default: null
  },
  tempo_maximo: {
    type: Number, // em minutos
    required: true
  },
  em_infracao: {
    type: Boolean,
    default: false
  },
  coima_aplicada: {
    type: Boolean,
    default: false
  },
  valor_coima: {
    type: Number,
    default: 0
  },
  aplicada_por: {
    type: String,
    default: null
  },
  observacoes: {
    type: String,
    default: ''
  },
  tipo_pagamento: {
    type: String,
    enum: ['pre-pago', 'pos-pago'],
    default: 'pos-pago'
},
  valor_a_pagar: {
    type: Number,
    default: 0
  },
  pagamento_realizado: {
    type: Boolean,
    default: false
  },
  metodo_pagamento: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Ocupacao || mongoose.model('Ocupacao', OcupacaoSchema);
