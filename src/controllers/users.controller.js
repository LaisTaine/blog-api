const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function cadastrarUsuario(req, res) {
    console.log('🔵 Chegou na rota de cadastro');
  const { nome, senha, perfil } = req.body;
    console.log('📦 Dados recebidos:', { nome, senha, perfil });

  if (!nome || !senha || !perfil) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, senha e perfil' });
  }

  const perfilNormalizado = perfil.toLowerCase();

  if (!['aluno', 'professor'].includes(perfilNormalizado)) {
    return res.status(400).json({ mensagem: 'Perfil inválido. Use "aluno" ou "professor".' });
  }

  // verifica se já existe
  const existe = await User.findOne({ nome });
  if (existe) {
    return res.status(409).json({ mensagem: 'Nome de usuário já cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = new User({
    nome,
    senhaHash,
    perfil: perfilNormalizado
  });

  await novoUsuario.save();

  res.status(201).json({
    id: novoUsuario._id,
    nome: novoUsuario.nome,
    perfil: novoUsuario.perfil
  });
}

module.exports = { cadastrarUsuario };
