require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


function ensureAuth(req,res,next) {
    console.log('Chave JWT usada para verificação:', JWT_SECRET);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json('Token não fornecido');
    }

    const [tipo, token] = authHeader.split(' ');
        if (tipo !== 'Bearer' || !token) {
            return res.status(401).json('Formato do token inválido');
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET);

            req.user = payload;

            next();
        } catch (erro) {
            return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
        }
}


module.exports = ensureAuth;