function onlyProfessor(req,res,next) {
    if(req.user.perfil !== 'professor'){
        return res.status(403).json({mensagem: 'Acesso restrito a professores.'});
    }

    next();
}

module.exports = onlyProfessor;