module.exports = app => {
    const { existsOrError, notExistsOrError, dateError } = app.api.validator

    const save = async (req, res) => {
        const projeto = { ...req.body }
        if(req.params.id) projeto.id = req.params.id

        try{
            existsOrError(projeto.name,'Nome do projeto não informado')
            existsOrError(projeto.dataIni,'Data Início não informada')
            existsOrError(projeto.dataFim,'Data Término não informada')
            dateError(projeto.dataIni, projeto.dataFim, 'Data de Término não pode ser infeior a Data de Início')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(projeto.id){
            app.db('projeto')
                .update(projeto)
                .where({id: projeto.id})
                .then(res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('projeto')
                .insert(projeto)
                .then(res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const get = (req, res) => {
        app.db('projeto')
        .select('id', 'name', 'dataIni', 'dataFim').orderBy('id')
        .then(projeto => res.json(projeto))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('projeto')
        .select('id', 'name', 'dataIni', 'dataFim').orderBy('id')
        .where({id: req.params.id})
            .first()
            .then(projetoById => res.json(projetoById))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const atividade = await app.db('atividade')
            .select('id')
            .where({idProjeto: req.params.id})

            notExistsOrError( atividade , 'Este Projeto possui uma ou mais Atividades e não poderá ser excluído')

        } catch(msg) {
            return res.status(400).send(msg)
        }

        const deleteProjeto = await app.db('projeto')
            .where({id: req.params.id}).del()            
            .then(res.status(204).send())
            .catch(err => res.status(500).send(err))
     
    }

    return { save, get, getById, remove }
}