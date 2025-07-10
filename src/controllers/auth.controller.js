require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

async function login(req,res) {
    const { nome, senha } = req.body;
        console.log('Tentativa de login:', nome, senha);

    const usuario = await User.findOne({nome});
    console.log('Usuário não encontrado');
    if (!usuario) {
        return res.status(400).json({mensagem: 'Credenciais inválidas'});
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaCorreta) {
        console.log('Senha incorreta');
        return res.status(400).json({mensagem: 'Credenciais inválidas'});
    }

console.log('Login bem-sucedido');

    const token = jwt.sign(
    {
        id: usuario.id,
        nome: usuario.nome,        
        perfil: usuario.perfil
    },
    JWT_SECRET,
    {
        expiresIn: '2h'
    }
    );


    res.json({token});

}

module.exports = { login, JWT_SECRET};