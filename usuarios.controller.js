const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        const item = await prisma.usuarios.create({
            data
        });

        res.status(201).json(item);

    } catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar usuário",
            error: error.message
        });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.usuarios.findMany();

        res.status(200).json(lista);

    } catch (error) {
        res.status(500).json({
            message: "Erro ao listar usuários",
            error: error.message
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });

        if (!item) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

        res.status(200).json(item);

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar usuário",
            error: error.message
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const item = await prisma.usuarios.update({
            where: { id: Number(id) },
            data: dados
        });

        res.status(200).json(item);

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar usuário",
            error: error.message
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.usuarios.delete({
            where: { id: Number(id) }
        });

        res.status(204).send();

    } catch (error) {
        res.status(500).json({
            message: "Erro ao excluir usuário",
            error: error.message
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};