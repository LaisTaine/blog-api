const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },
    senhaHash: {
      type: String,
      required: true
    },
    perfil: {
      type: String,
      enum: ['aluno', 'professor', 'admin'],
      default: 'aluno',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
