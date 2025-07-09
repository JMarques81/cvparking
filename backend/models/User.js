const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  permissoes: {
    type: [String],
    enum: ['publico', 'fiscal', 'admin'],
    default: ['publico'],
    required: true
  },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);