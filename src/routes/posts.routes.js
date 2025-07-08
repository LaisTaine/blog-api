const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const ensureAuth = require('../middlewares/ensureAuth');
const onlyProfessor = require('../middlewares/onlyProfessor');

// rotas públicas
router.get('/', postsController.listarPosts);
router.get('/search', postsController.buscarPost);
router.get('/:id', postsController.mostrarPosts);

//rotas protegidas
router.post('/', ensureAuth, onlyProfessor, postsController.criarPosts);
router.put('/:id', ensureAuth, onlyProfessor, postsController.atualizarPost);
router.delete('/:id', ensureAuth, onlyProfessor, postsController.excluirPost);

module.exports = router;

