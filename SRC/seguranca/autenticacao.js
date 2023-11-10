const jwt = require('jsonwebtoken');
const { segredoJwt } = require('./config');
const Usuario = require('./models/Usuario');

const autenticarUsuario = async (req, res, next) => {
const token = req.header('Autorização');

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso não autorizado' });
    }

    try {
const decoded = jwt.verify(token, segredoJwt);
const usuario = await Usuario.findOne({ where: { id: decoded.id } });
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado' });
        }

        req.usuario = { id: decoded.id, nome: usuario.nome, email: usuario.email };

        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Acesso não autorizado' });
    }
};

const protegerContraAtaques = (req, res, next) => {
    if (req.query && req.query.q) {
const q = req.query.q;
        if (q.includes(';')) {
            return res.status(400).json({ mensagem: 'Consulta inválida' });
        }
    }

    if (req.body.csrfToken !== req.cookies.csrfToken) {
        return res.status(403).json({ mensagem: 'Ação não autorizada (CSRF)' });
    }

    next();
};

const verificarPermissoes = (req, res, next) => {
const { usuario } = req;

    if (usuario && usuario.admin) {
        return next();
    }

    return res.status(403).json({ mensagem: 'Acesso proibido' });
};

module.exports = { autenticarUsuario, protegerContraAtaques, verificarPermissoes };