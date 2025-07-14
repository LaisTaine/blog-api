const bcrypt = require('bcryptjs');
const User = require('../models/User');

const cadastrarUsuarioService = async (dadosDoNovoUsuario) => {
  const { nome, senha, perfil } = dadosDoNovoUsuario;

  if (!nome || !senha) {
    throw new Error('Campos obrigatórios: nome e senha');
  }


  const existe = await User.findOne({ nome });
  if (existe) {
    throw new Error('Nome de utilizador já cadastrado');
  }


  const senhaHash = await bcrypt.hash(senha, 10);

  const totalDeUtilizadores = await User.countDocuments();
  let perfilFinal = 'aluno'; 

  if (totalDeUtilizadores === 0) {
    perfilFinal = 'admin';
    console.log(`Primeiro utilizador do sistema! Promovendo '${nome}' a administrador.`);
  }

  // Criação do utilizador no banco de dados
  const novoUsuario = await User.create({
    nome,
    senhaHash,
    perfil: perfilFinal
  });


  return novoUsuario;
};


//Rota exclusiva para admins
const criarUsuarioPeloAdminService = async (dadosDoNovoUsuario) => {
    const { nome, senha, perfil } = dadosDoNovoUsuario;

    if (!nome || !senha || !perfil) {
        throw new Error('Nome, senha e perfil são obrigatórios.');
    }

    const existe = await User.findOne({ nome });
    if (existe) {
        throw new Error('Nome de utilizador já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await User.create({
        nome,
        senhaHash,
        perfil 
    });

    return novoUsuario;
};


const listarTodosUsuariosService = async () => {
    const usuarios = await User.find({}, '-senhaHash');
    return usuarios;
};


const deletarUsuarioService = async (id) => {
  const utilizador = await User.findByIdAndDelete(id);

  if (!utilizador) {
    throw new Error('Utilizador não encontrado');
  }
};


module.exports = {
    cadastrarUsuarioService,
    criarUsuarioPeloAdminService,
    listarTodosUsuariosService,
    deletarUsuarioService
}