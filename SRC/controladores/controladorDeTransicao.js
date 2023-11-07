const categorias = [];
const transacoes = [];

const listarCategorias = (req, res) => {
  return res.status(200).json(categorias);
};

const listarTransacoes = (req, res) => {
  return res.status(200).json(transacoes);
};

const detalharTransacao = (req, res) => {
  const { transacaoId } = req.params;
  const transacao = transacoes.find((t) => t.id === transacaoId);

  if (!transacao) {
    return res.status(404).json({ mensagem: 'Transação não encontrada' });
  }

  return res.status(200).json(transacao);
};

const cadastrarTransacao = (req, res) => {
  const { categoriaId, descricao, valor } = req.body;

  if (!categoriaId || !descricao || !valor) {
    return res.status(400).json({ mensagem: 'Categoria, descrição e valor são obrigatórios' });
  }

  const categoria = categorias.find((c) => c.id === categoriaId);

  if (!categoria) {
    return res.status(400).json({ mensagem: 'Categoria não encontrada' });
  }

  const novaTransacao = {
    id: String(transacoes.length + 1),
    categoriaId,
    descricao,
    valor,
  };

  transacoes.push(novaTransacao);

  return res.status(201).json({ mensagem: 'Transação cadastrada com sucesso' });
};

const editarTransacao = (req, res) => {
  const { transacaoId } = req.params;
  const { categoriaId, descricao, valor } = req.body;
  const transacao = transacoes.find((t) => t.id === transacaoId);

  if (!transacao) {
    return res.status(404).json({ mensagem: 'Transação não encontrada' });
  }

  if (categoriaId) {
    const categoria = categorias.find((c) => c.id === categoriaId);

    if (!categoria) {
      return res.status(400).json({ mensagem: 'Categoria não encontrada' });
    }

    transacao.categoriaId = categoriaId;
  }

  if (descricao) {
    transacao.descricao = descricao;
  }

  if (valor) {
    transacao.valor = valor;
  }

  return res.status(200).json({ mensagem: 'Transação atualizada com sucesso', transacao });
};

const removerTransacao = (req, res) => {
  const { transacaoId } = req.params;
  const index = transacoes.findIndex((t) => t.id === transacaoId);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Transação não encontrada' });
  }

  transacoes.splice(index, 1);

  return res.status(200).json({ mensagem: 'Transação removida com sucesso' });
};

const obterExtrato = (req, res) => {
  const { dataInicial, dataFinal, categoriaId } = req.query;

  let extratoFiltrado = [...transacoes]; 

  if (dataInicial && dataFinal) {
    extratoFiltrado = extratoFiltrado.filter((t) => t.data >= dataInicial && t.data <= dataFinal);
  }

  if (categoriaId) {
    extratoFiltrado = extratoFiltrado.filter((t) => t.categoriaId === categoriaId);
  }

  const saldoTotal = extratoFiltrado.reduce((saldo, transacao) => {
    return saldo + transacao.valor;
  }, 0);

  return res.status(200).json({ extrato: extratoFiltrado, saldoTotal });
};

const filtrarTransacoesPorCategoria = (req, res) => {
  const { categoriaId } = req.params;
  const transacoesFiltradas = transacoes.filter((t) => t.categoriaId === categoriaId);

  return res.status(200).json(transacoesFiltradas);
};

module.exports = {
  listarCategorias,
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacao,
  editarTransacao,
  removerTransacao,
  obterExtrato,
  filtrarTransacoesPorCategoria,
};