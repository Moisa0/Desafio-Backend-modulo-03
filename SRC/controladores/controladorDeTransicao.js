
const pool = require('../bancoDeDados/conexao')

const listarCategorias = async (req, res) => {
  try {
    const category = await pool.query(`select * from categorias`);
    return res.status(200).json(category.rows);
} catch (error) {
    return res.status(400).json({ error: 'Ocorreu um erro ao listar as categorias' });
}
};

const listarTransacoes = async (req, res) => {
  const {id} = req.usuario
  try {
    const usuarioId = id;
    let query = `
        select t.*, c.descricao as categoria_nome 
        from transacoes t join categorias c on t.categoria_id = c.id 
        where t.usuario_id = $1
    `;

    const { filtro } = req.query;

    if (filtro) {
        const categoriasFiltro = Array.isArray(filtro) ? filtro : [filtro];
        const filtroDoQ = ' and lower(c.descricao) = any($2::text[]) or c.descricao = any($3::text[])';
        query += filtroDoQ;

        const qualquerTransacao = await pool.query(query, [
            usuarioId,
            categoriasFiltro.map(cat => cat.toLowerCase()),
            categoriasFiltro,
        ]);

        const transacao = qualquerTransacao.rows.map(transacao => ({
            ...transacao, valor: parseFloat(transacao.valor)
        }));

        return res.json(transacao);
    } else {
        const qualquerTransacao = await pool.query(query, [usuarioId]);

        const transacao = qualquerTransacao.rows.map(transacao => ({
            ...transacao, valor: parseFloat(transacao.valor)
        }));

        return res.json(transacao);
    }
} catch (error) {
    console.error('Ocorreu um erro ao listar as transações:', error);
    return res.status(400).json({ error: 'Ocorreu um erro ao listar as transações' });
}
};



const detalharTransacao = async (req, res) => {
  try {

    const qualquerTransacao = await pool.query(`select * from transacoes where id = $1 and usuario_id = $2`, [req.params.id, req.usuario.id]);

    if (qualquerTransacao.rowCount === 0) {
        return res.status(400).json({ error: 'A transação requerida não foi encontrada' });
    }

    const transacao = {
        ...qualquerTransacao.rows[0],
        valor: parseFloat(qualquerTransacao.rows[0].valor)
    };

    return res.status(200).json(transacao);
} catch (error) {
    return res.status(400).json({ error: 'Erro ao detalhar transação' });
}
};

const cadastrarTransacao = async (req, res) => {
const { categoria_id, descricao, valor, tipo, data } = req.body;

try {
  if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({ mensagem: 'Verifique se os campos foram informados' });
  }

  const categoria = await pool.query(`select * from categorias where id = $1`, [categoria_id]);
  if (categoria.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Categoria não existe' });
  }

  const query = `
      insert into transacoes (tipo, descricao, valor, data, usuario_id, categoria_id)
      values ($1, $2, $3, $4, $5, $6)
      returning 
          id,
          tipo,
          descricao,
          valor,
          data,
          usuario_id,
          categoria_id                
  `;

  const transacao = await pool.query(query, [tipo, descricao, valor, data, usuarioId, categoria_id]);

  transacao.rows[0].valor = parseFloat(transacao.rows[0].valor);

  transacao.rows[0].categoria_nome = categoria.rows[0].descricao;

  return res.status(201).json(transacao.rows[0]);
} catch (error) {
  console.error('Ocorreu um erro durante o cadastro da transacao:', error);
  return res.status(400).json({ mensagem:'Ocorreu um erro durante o cadastro da transacao' });
}
}

const editarTransacao = async (req, res) => {
const transacaoId = req.params.id;
const { categoria_id, descricao, valor, data } = req.body;
const { id: usuarioId } = req.usuario;
if (!descricao || !valor || !data || !categoria_id || !tipo) {
  return res.status(400).json({ error: 'Preencha todos os campos' });
}

try {
  const transacaoPronta = await pool.query(`select * from transacoes where id = $1 and usuario_id = $2`, [transacaoId, usuarioId]);

  if (transacaoPronta.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Esta transição não existe' });
  }

  const categoriaPronta = await pool.query(`select * from categorias where id = $1`, [categoria_id]);

  if (categoriaPronta.rowCount === 0) {
      return res.status(400).json({ error: 'Esta categoria não existe' });
  }


  const query = `
      update transacoes 
      set descricao = $1, valor = $2, 
      data = $3, categoria_id = $4, tipo = $5 
      where id = $6
      returning *
  `;

  const transacaoNova = await pool.query(query, [descricao, valor, data, categoria_id, tipo, transacaoId]);

  const transacao = {
      ...transacaoNova.rows[0],
      valor: parseFloat(transacaoNova.rows[0].valor)
  };

  return res.json(transacao);
} catch (error) {
  return res.status(400).json({ error: 'Ocorreu um erro durante o processo' });
}

}

const removerTransacao = (req, res) => {
const { transacaoId } = req.params;
const index = transacoes.findIndex((t) => t.id === transacaoId);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Transação não encontrada' });
  }

  transacoes.splice(index, 1);

  return res.status(200).json({ mensagem: 'Transação removida com sucesso' });
};

const obterExtrato = async (req, res) => {
  const { id: usuarioId } = req.usuario;

  try {
      const entradas = await pool.query(`select sum(valor) as total_entradas from transacoes where usuario_id = $1 and tipo = 'entrada'`, [usuarioId]);
      const totalEntradas = parseFloat(entradas.rows[0].total_entradas) || 0;

      const saidas = await pool.query(`select sum(valor) as total_saidas from transacoes where usuario_id = $1 and tipo = 'saida'`, [usuarioId]);
      const totalSaidas = parseFloat(saidas.rows[0].total_saidas) || 0;

      const extrato = {
          entrada: totalEntradas,
          saida: totalSaidas
      }

      return res.json(extrato);
  } catch (error) {
      return res.status(500).json({ error: 'Aconteceu um erro interno no servidor' });
  }
};

const filtrarTransacoesPorCategoria = async (req, res) => {
  try {
    const categorias = await pool.query(`select * from categorias`);
    return res.status.json(categorias.rows);
} catch (error) {
    return res.status(400).json({ error: 'Erro ao listar categorias' });
}
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
