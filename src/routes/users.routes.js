const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const ensureAuth = require('../middlewares/ensureAuth');
const onlyAdmin = require('../middlewares/onlyAdmin');

// --- Rotas Públicas ---
// POST /usuarios -> Regista um novo utilizador público (que será 'aluno').
router.post('/', userController.cadastrarUsuario);

// --- Rotas Protegidas ---
// GET /usuarios -> Lista todos os utilizadores (só para admins).
router.get('/', ensureAuth, onlyAdmin, userController.listarUsuarios);

// POST /usuarios/admin/criar -> Cria um novo utilizador com um perfil específico (só para admins).
router.post('/admin/criar', ensureAuth, onlyAdmin, userController.criarUsuarioPeloAdmin);

// DELETE /usuarios/:id -> Apaga um utilizador específico (só para admins).
router.delete('/:id', ensureAuth, onlyAdmin, userController.deletarUsuario);


module.exports = router;