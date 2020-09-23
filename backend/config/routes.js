module.exports = app => {
    app.route('/projetos')
        .post(app.api.projeto.save)
        .get(app.api.projeto.get)

    app.route('/projetos/:id')
        .get(app.api.projeto.getById)
        .put(app.api.projeto.save)
        .delete(app.api.projeto.remove)


    app.route('/atividades/:id')
        .post(app.api.atividade.insert)
        .get(app.api.atividade.get)

    app.route('/atividades/:id/:id')
        .put(app.api.atividade.update)
        .delete(app.api.atividade.remove)        

    app.route('/getQtdeAtividade/:id')
        .get(app.api.getQtdeAtividade.getQtdeAtividade)

    app.route('/getQtdeAtividadeFinalizadas/:id')
        .get(app.api.getQtdeAtividadeFinalizadas.getQtdeAtividadeFinalizadas)
}