const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

const ensureAuth = require('../middlewares/ensureAuth');
const onlyAdmin = require('../middlewares/onlyAdmin');

router.post('/admin/criar', ensureAuth, onlyAdmin, userController.criarUsuarioPeloAdmin);

router.post ('/', userController.cadastrarUsuario);

router.get('/', ensureAuth, onlyAdmin, userController.listarUsuarios);

module.exports = router;