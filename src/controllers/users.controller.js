const userService = require('../services/user.services');


const criarUsuarioPeloAdmin = async (req, res) => {
    console.log('✅ EXECUTANDO: criarUsuarioPeloAdmin'); // Pista 1
    try {
        const novoUsuario = await userService.criarUsuarioPeloAdminService(req.body);
        
        res.status(201).json({
            id: novoUsuario._id,
            nome: novoUsuario.nome,
            perfil: novoUsuario.perfil
        });
    } catch (erro) {
        res.status(400).json({ mensagem: erro.message });
    }
};


const cadastrarUsuario = async (req, res) => {
  console.log('❌ EXECUTANDO: cadastrarUsuario'); // Pista 2
  try {
    const usuarioCriado = await userService.cadastrarUsuarioService(req.body);

    res.status(201).json({
      id: usuarioCriado._id,
      nome: usuarioCriado.nome,
      perfil: usuarioCriado.perfil
    });

  } catch (erro) {
    if (erro.message.includes('já cadastrado')) {
      return res.status(409).json({ mensagem: erro.message }); 
    }
    if (erro.message.includes('obrigatórios')) {
      return res.status(400).json({ mensagem: erro.message }); 
    }
    
    console.error('Erro no cadastro de utilizador:', erro);
    res.status(500).json({ mensagem: 'Ocorreu um erro interno.' });
  }
};


const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.listarTodosUsuariosService();
    res.status(200).json(usuarios);
  } catch (erro) {
    console.error('Erro ao listar utilizadores:', erro);
    res.status(500).json({ mensagem: 'Ocorreu um erro interno.' });
  }
};

module.exports = { 
  cadastrarUsuario, 
  criarUsuarioPeloAdmin,
  listarUsuarios
};
