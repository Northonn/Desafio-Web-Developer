module.exports = app => {

    const getQtdeAtividadeFinalizadas = (req, res) => {
        app.db('atividade')
        .count('id as  QtdeAtividadeFinalizadas')
        .where({idProjeto: req.params.id, finalizada: 't'})
            .first()
            .then(atividadeById => res.json(atividadeById))
            .catch(err => res.status(500).send(err))
    }


    return { getQtdeAtividadeFinalizadas }
}