const mongoose = require('mongoose');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewURLParser: true,
            useUnifiedTopology: true
        });
        
        console.log('🟢 Conectado ao MongoDB com sucesso!');

    } catch (erro) {
        console.error('🔴 Erro ao conectar ao MongoDB:', erro.message);
        process.exit(1);
    }
}

module.exports = connect;