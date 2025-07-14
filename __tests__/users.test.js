const request = require('supertest');
const app = require('../src/app'); 
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Testes dos Endpoints de Utilizadores', () => {
    // Definimos as variáveis de token aqui para que todos os testes no 'describe' as possam aceder
    let adminToken;
    let alunoToken;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        await User.deleteMany({});

        // LÓGICA DE CRIAÇÃO DE UTILIZADORES DE TESTE

        // CRIA UTILIZADOR ADMIN
        const senhaHashAdmin = await bcrypt.hash('senha123', 10);
        const adminUser = await User.create({
            nome: 'Admin Teste',
            senhaHash: senhaHashAdmin,
            perfil: 'admin'
        });
        adminToken = jwt.sign({ id: adminUser.id, nome: adminUser.nome, perfil: adminUser.perfil }, process.env.JWT_SECRET);

        // CRIA UTILIZADOR ALUNO
        const senhaHashAluno = await bcrypt.hash('senha123', 10);
        const alunoUser = await User.create({
            nome: 'Aluno Teste',
            senhaHash: senhaHashAluno,
            perfil: 'aluno'
        });
        alunoToken = jwt.sign({ id: alunoUser.id, nome: alunoUser.nome, perfil: alunoUser.perfil }, process.env.JWT_SECRET);
    });

    
    afterAll(async () => {
        await mongoose.connection.close();
    });

    
    // TESTES

    it('Deve registar um novo utilizador público com o perfil de aluno', async () => {
        const novoUsuario = {
            nome: 'Novo Aluno Publico',
            senha: 'senha123',
        };

        const res = await request(app)
            .post('/usuarios')
            .send(novoUsuario);

        expect(res.statusCode).toEqual(201);
        expect(res.body.perfil).toBe('aluno');
        expect(res.body.nome).toBe(novoUsuario.nome);
    });

    it('Deve permitir que um admin liste todos os utilizadores', async () => {
        const res = await request(app)
            .get('/usuarios')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        const users = await User.find();
        expect(users.length).toBe(3);
        expect(res.body[0]).not.toHaveProperty('senhaHash');
    });

    it('NÃO deve permitir que um aluno liste todos os utilizadores', async () => {
        const res = await request(app)
            .get('/usuarios')
            .set('Authorization', `Bearer ${alunoToken}`); 

        expect(res.statusCode).toEqual(403);
    });

    it('Deve permitir que um admin crie um novo utilizador professor', async () => {
        const novoProfessor = {
            nome: 'Novo Professor',
            senha: 'senha123',
            perfil: 'professor'
        };

        const res = await request(app)
            .post('/usuarios/admin/criar') 
            .set('Authorization', `Bearer ${adminToken}`) 
            .send(novoProfessor);

        expect(res.statusCode).toEqual(201);
        expect(res.body.perfil).toBe('professor');

        const professorNoBanco = await User.findOne({ nome: 'Novo Professor' });
        expect(professorNoBanco).not.toBeNull();
    });

});