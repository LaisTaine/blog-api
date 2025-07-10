const postService = require('../services/post.services');
const Post = require('../models/Post');

//GET SEARCH/ID - Passa para o service
const buscarPost = async (req, res) => {
  try {
    const { termo } = req.query;
    const resultados = await postService.buscarPostService(termo); //Busca na lógica do post.service.js
    res.json(resultados);
  } catch (erro) {
    if (erro.message.includes('obrigatório')) {
      return res.status(400).json({ mensagem: erro.message });
    }
    console.error('Erro ao buscar posts:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar posts' });
  }
};


//DELETE /POST - Passa para o service
const excluirPost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.excluirPostService(id);
    res.status(204).send();

  } catch (erro) {
    if (erro.message === 'Post não encontrado') {
      return res.status(404).json({ mensagem: erro.message });
    }
    console.error('Erro ao excluir post:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao excluir Post.' });
  }
};


//PUT /POST - Passa para o service
const atualizarPost = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const postAtualizado = await postService.atualizarPostService(id, dados); //Puxa informações do Service

    res.json(postAtualizado);//Envia resposta

  } catch (erro) {
    if (erro.message === 'Post não encontrado') {
      return res.status(404).json({ mensagem: erro.message });
    }
    console.error('Erro ao atualizar post:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao atualizar post' });
  }
};


//POST /POST
const criarPosts = async (req, res) => {
  try {
    const dadosDoPost = req.body;
    const dadosDoUsuario = req.user;

    const novoPost = await postService.criarPostService(dadosDoPost, dadosDoUsuario); //Service

    res.status(201).json(novoPost);

  } catch (erro) {
      if (erro.message.includes('obrigatórios')) {
      return res.status(400).json({ mensagem: erro.message }); // 400 = Bad Request
    }
    console.error('Erro ao criar Post:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao criar Post.' });
  }
};



// GET e GET BY ID - passa para o service
const listarPosts = async (req, res) => {
  try {
    const posts = await postService.listarPostsService();
    res.json(posts);
  } catch (erro) {
    console.error('Erro ao listar posts:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar posts' });
  }
};

const mostrarPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.mostrarPostPorIdService(id);
    res.json(post);
  } catch (erro) {
    if (erro.message === 'Post não encontrado') {
      return res.status(404).json({ mensagem: erro.message });
    }
    console.error('Erro ao buscar post por ID:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar post' });
  }
};

module.exports = {
    listarPosts,
    mostrarPosts,
    criarPosts, 
    atualizarPost,
    excluirPost,
    buscarPost
}