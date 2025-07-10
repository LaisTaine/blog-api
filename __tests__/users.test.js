const request = require('supertest');
const app = require('../src/app'); 
const mongoose = require('mongoose');
const User = require('../src/models/User');


describe('Testes dos Endpoints de Utilizadores', () => {

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

afterAll(async () => {
    await mongoose.connection.close();
  });

beforeEach(async () => {
    await User.deleteMany({});
  });

it('Deve criar um novo utilizador com sucesso ao fazer um POST em /usuarios', async () => {
    const novoUsuario = {
      nome: 'Lais Teste',
      senha: 'senha123',
      perfil: 'aluno'
    };

    const res = await request(app)
      .post('/usuarios')
      .send(novoUsuario);


    expect(res.statusCode).toEqual(201);

    expect(res.body).toHaveProperty('id'); 
    expect(res.body.nome).toBe(novoUsuario.nome);
    expect(res.body).not.toHaveProperty('senhaHash');


    const utilizadorNoBanco = await User.findOne({ nome: novoUsuario.nome });
    expect(utilizadorNoBanco).not.toBeNull();
    expect(utilizadorNoBanco.nome).toBe(novoUsuario.nome);
    expect(utilizadorNoBanco.senhaHash).not.toBe(novoUsuario.senha);
  });
});