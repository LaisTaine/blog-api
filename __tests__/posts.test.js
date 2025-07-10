const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Post = require('../src/models/Post');
const User = require('../src/models/User'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');

describe('Testes dos Endpoints de Posts', () => {
    let professorToken;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        await User.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash('senha-teste-123', salt);

        const professor = await User.create({
            nome: 'Professor de Teste',
            perfil: 'professor',
            senhaHash: senhaHash 
        });

        professorToken = jwt.sign(
            { id: professor.id, nome: professor.nome, perfil: professor.perfil }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Post.deleteMany({});
    });

    
    // ----- INÍCIO DOS TESTES -----

    it('Deve retornar uma lista vazia de posts', async () => {
        const res = await request(app).get('/posts'); 
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    it('Deve criar um novo post com um utilizador professor autenticado', async () => {
        const novoPost = {
            titulo: 'Post criado via teste',
            conteudo: 'Conteúdo do meu teste automatizado.'
        };

        const res = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${professorToken}`)
            .send(novoPost);

        expect(res.statusCode).toEqual(201);
        expect(res.body.titulo).toBe(novoPost.titulo);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.autor).toBe('Professor de Teste');
    });

    it('Deve excluir um post existente', async () => {
        const postParaDeletar = await Post.create({
            titulo: 'Post a ser deletado',
            conteudo: 'Conteúdo...',
            autor: 'Professor de Teste'
        });
        const postId = postParaDeletar._id;

        const res = await request(app)
            .delete(`/posts/${postId}`)
            .set('Authorization', `Bearer ${professorToken}`);

        expect(res.statusCode).toEqual(204);
        const postNoBanco = await Post.findById(postId);
        expect(postNoBanco).toBeNull();
    });

    it('Deve atualizar um post existente', async () => {
        const postInicial = await Post.create({
            titulo: 'Título Original',
            conteudo: 'Conteúdo original.',
            autor: 'Professor de Teste'
        });
        const postId = postInicial._id;
        const dadosAtualizados = { titulo: 'Título Atualizado' };

        const res = await request(app)
            .put(`/posts/${postId}`) 
            .set('Authorization', `Bearer ${professorToken}`) 
            .send(dadosAtualizados);

        expect(res.statusCode).toEqual(200);
        expect(res.body.titulo).toBe(dadosAtualizados.titulo);
        const postNoBanco = await Post.findById(postId);
        expect(postNoBanco.titulo).toBe(dadosAtualizados.titulo);
    });
});