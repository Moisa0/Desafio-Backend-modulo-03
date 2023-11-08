const usuarios = [];


const cadastrarUsuario = (req, res) => {
const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
    }

const novoUsuario = {
        nome,
        email,
        senha,
    };

    usuarios.push(novoUsuario);

    return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso' });
};


const fazerLogin = (req, res) => {
const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

const usuario = usuarios.find((user) => user.email === email && user.senha === senha);

    if (!usuario) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }


    return res.status(200).json({ mensagem: 'Login bem-sucedido' });
};


const detalharPerfil = (req, res) => {

const usuarioLogado = req.usuario;

    return res.status(200).json(usuarioLogado);
};

const editarPerfil = (req, res) => {
const { nome, email } = req.body;
const usuarioLogado = req.usuario;

    if (nome) {
        usuarioLogado.nome = nome;
    }

    if (email) {
        usuarioLogado.email = email;
    }

    return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso', usuario: usuarioLogado });
};

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    detalharPerfil,
    editarPerfil,
};
