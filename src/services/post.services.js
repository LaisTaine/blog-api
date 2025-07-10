const Post = require('../models/Post');

// Lógica para buscar posts por um termo GET /SEARCH
const buscarPostService = async (termo) => {
  if (!termo) {
    throw new Error('Parâmetro "termo" é obrigatório na busca');
  }

  const termoRegex = new RegExp(termo, 'i');
  const resultados = await Post.find({
    $or: [
      { titulo: { $regex: termoRegex } },
      { conteudo: { $regex: termoRegex } }
    ]
  });

  return resultados;
};

//Lógica para deletar posts - DELETE
const excluirPostService = async (id) => {
  const postExcluido = await Post.findByIdAndDelete(id);
  if (!postExcluido) {
    throw new Error('Post não encontrado');
  }
};


//Lógica para atualizar post - PUT
const atualizarPostService = async (id, dados) => {
    const { titulo, conteudo } = dados;

    const postAtualizado = await Post.findByIdAndUpdate(
        id,
        {
        ...(titulo && { titulo }),
        ...(conteudo && { conteudo })
        },
        { new: true } 
    );

    if (!postAtualizado) {
        throw new Error('Post não encontrado');
    }

    return postAtualizado;
};


//Lógica para criar um novo post
const criarPostService = async (dadosDoPost, dadosDoUsuario) => {
  const { titulo, conteudo } = dadosDoPost;
  const autor = dadosDoUsuario.nome;

  if (!titulo || !conteudo) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  const novoPost = await Post.create({
    titulo,
    conteudo,
    autor
  });


  return novoPost;
};


// Lógica para listar todos os posts
const listarPostsService = async () => {
  const posts = await Post.find().sort({ createdAt: -1 });
  return posts;
};

// Lógica para mostrar um post por ID
const mostrarPostPorIdService = async (id) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new Error('Post não encontrado');
  }

  return post;
};

module.exports = {
  buscarPostService,
  excluirPostService,
  atualizarPostService,
  criarPostService,
  listarPostsService,
  mostrarPostPorIdService
}