const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        data.data_evento = new Date(data.data_evento);

        const item = await prisma.eventos.create({
            data
        });

        return res.status(201).json(item);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao cadastrar evento",
        });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.eventos.findMany();

        return res.status(200).json(lista);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao listar eventos",
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.eventos.findUnique({
            where: { id: Number(id) }
        });

        if (!item) {
            return res.status(404).json({
                erro: "Evento não encontrado"
            });
        }

        return res.status(200).json(item);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao buscar evento",
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        if (dados.data_evento) {
            dados.data_evento = new Date(dados.data_evento);
        }

        const item = await prisma.eventos.update({
            where: { id: Number(id) },
            data: dados
        });

        return res.status(200).json(item);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao atualizar evento",
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await prisma.eventos.findUnique({
            where: { id: Number(id) }
        });

        if (!evento) {
            return res.status(404).json({
                erro: "Evento não encontrado"
            });
        }

        const hoje = new Date();

        if (evento.data_evento < hoje) {
            return res.status(400).json({
                erro: "Não é possível excluir um evento que já aconteceu"
            });
        }

        const participantesCount = await prisma.participantes.count({
            where: {
                eventoId: Number(id)
            }
        });

        if (participantesCount > 0) {
            return res.status(400).json({
                erro: "Não é possível excluir um evento com participantes registrados"
            });
        }

        const item = await prisma.eventos.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json(item);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao excluir evento",
        });
    }
};

const encerrarEvento = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await prisma.eventos.findUnique({
            where: { id: Number(id) }
        });

        if (!evento) {
            return res.status(404).json({
                erro: "Evento não encontrado"
            });
        }

        const hoje = new Date();

        if (evento.data_evento > hoje) {
            return res.status(400).json({
                erro: "O evento ainda não foi encerrado"
            });
        }

        const resultado = await prisma.participantes.updateMany({
            where: {
                eventoId: Number(id),
                status: "LISTA_ESPERA"
            },
            data: {
                status: "CANCELADA"
            }
        });

        return res.status(200).json({
            mensagem: "Evento encerrado com sucesso",
            inscricoesCanceladas: resultado.count
        });

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao encerrar evento",
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    encerrarEvento
};
