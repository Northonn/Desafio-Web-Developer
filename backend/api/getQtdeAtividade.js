module.exports = app => {

    const getQtdeAtividade = (req, res) => {
        app.db('atividade')
        .count('id as QtdeAtividade')
        .where({idProjeto: req.params.id})
            .first()
            .then(atividadeById => res.json(atividadeById))
            .catch(err => res.status(500).send(err))
    }

    return { getQtdeAtividade }
}