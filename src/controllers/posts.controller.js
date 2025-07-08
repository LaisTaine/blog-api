
//Dados fictícios para get postsId
const posts = [
  { id: 1, titulo: 'Bem-vindos ao blog!', conteudo: 'Este é o primeiro post.', autor: 'Prof. João' },
  { id: 2, titulo: 'Dicas de estudo', conteudo: 'Estudar com rotina ajuda muito.', autor: 'Profª. Ana' }
];

//Função para pesquisar post - GET SEARCH
function buscarPost(req,res) {
  const termo = req.query.termo;

  if (!termo) {
    return res.status(400).json({mensagem: 'Parâmetro "termo" é obrigatório na busca'})
  }

  const termoMinusculo = termo.toLowerCase();

  const resultados = posts.filter(post => 
    post.titulo.toLowerCase().includes(termoMinusculo) ||
    post.conteudo.toLowerCase().includes(termoMinusculo)
  );

  res.json(resultados);
}


//Função para deletar post - DELETE
function excluirPost(req, res) {
  const id = parseInt(req.params.id);
  const index = posts.findIndex(post => post.id === id);

  if (index === -1) {
    return res.status(404).json({mensagem: 'Post não encontrado'});
  };

  posts.splice(index, 1);

  res.status(204).send();
}


//Função para atualizar post - PUT
function atualizarPost(req,res) {
  const id = parseInt(req.params.id);
  const {titulo, conteudo, autor} = req.body;
  const post = posts.find(post => post.id === id);

  if (!post) {
    return res.status(400).json({ mensagem: 'Post não encontrado'});
  }

  if (titulo) post.titulo = titulo;
  if (conteudo) post.conteudo = conteudo;
  if (autor) post.autor = autor;

  res.json(post);
}


//Função para criar post - POST
function criarPosts(req,res) {
  const {titulo, conteudo} = req.body;
  const autor = req.user.nome;
  console.log(req.user);

  if (!titulo || !conteudo) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.'});
}

const novoPost = {
  id: posts.length + 1,
  titulo,
  conteudo,
  autor
};

posts.push(novoPost);

res.status(201).json(novoPost);
}



//Função para mostrar lista de posts - GET
function listarPosts(req, res) {
    res.send('Lista de Posts');
}


//Função para mostrar posts unitários - GET BY ID
function mostrarPosts(req, res) {
    const id = parseInt(req.params.id); // captura o ID e converte para o número
    const postEncontrado = posts.find(posts => posts.id === id);

    if (!postEncontrado) {
    return res.status(404).send('Post não encontrado');
  }

  res.json(postEncontrado);
}

module.exports = {
    listarPosts,
    mostrarPosts,
    criarPosts, 
    atualizarPost,
    excluirPost,
    buscarPost
}