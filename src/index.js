require('dotenv').config();
const connect = require('./config/database');
connect();
const express = require('express'); //importando o express
const app = express(); //cria uma instância do servidor Express/ chamando o express
const PORT = 3000;

//middleware para ler json
app.use(express.json());


const postsRoutes = require('./routes/posts.routes');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');

//rotas
app.use('/', authRoutes);

app.use('/usuarios', usersRoutes);

app.use('/posts', postsRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


module.exports = app;