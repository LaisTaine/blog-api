const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewURLParser: true,
            useUnifiedTopology: true
        });
        
        console.log('🟢 Conectado ao MongoDB com sucesso!');

    } catch (erro) {
        console.error('🔴 Erro ao conectar ao MongoDB:', erro.message);
    }
}

module.exports = connect;