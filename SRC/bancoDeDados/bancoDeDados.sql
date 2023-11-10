CREATE TABLE usuarios (
    id serial PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
    id serial PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

INSERT INTO categorias (descricao)
VALUES
    ('Alimentação'),
    ('Assinaturas e Serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Família'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras receitas'),
    ('Outras despesas');

CREATE TABLE transacoes (
    id serial PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data DATE NOT NULL,
    categoria_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo VARCHAR(20) NOT NULL
);