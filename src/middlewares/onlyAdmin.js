const onlyAdmin = (req, res, next) => {
    if (req.user && req.user.perfil === 'admin') {
        next();
    } else {
        res.status(403).json({ mensagem: 'Acesso negado. Rota exclusiva para administradores.' });
    }
};

module.exports = onlyAdmin;