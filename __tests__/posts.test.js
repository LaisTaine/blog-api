const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');

// Descreve o conjunto de testes para os endpoints de Posts
describe('Testes dos Endpoints de Posts',() => {

    // Antes de todos os testes, conecta ao banco de dados
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
  });

    // Depois de todos os testes, desconecta do banco
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // O teste em si
    it('Deve retornar todos os posts ao fazer um GET em /posts', async () => {
    
    // Faz a requisição para a rota
    const res = await request(app).get('/posts'); 

    // Verifica o status da resposta
    expect(res.statusCode).toEqual(200);

    // Verifica se o corpo da resposta é um array (lista de posts)
    expect(Array.isArray(res.body)).toBe(true);
  });

});