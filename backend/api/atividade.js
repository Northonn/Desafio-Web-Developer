module.exports = app => {
    const { existsOrError, dateError } = app.api.validator

    const insert = async (req, res) => {
        const atividade = { ...req.body }

        try{

            existsOrError(atividade.name,'Nome da atividade não informada')
            existsOrError(atividade.dataIni,'Data Início não informada')
            existsOrError(atividade.dataFim,'Data Término não informada')
            existsOrError(atividade.idProjeto,'ID do projeto não informado')
            dateError(atividade.dataIni, atividade.dataFim, 'Data de Término não pode ser infeior a Data de Início')

        } catch(msg) {
            return res.status(400).send(msg)
        }

        app.db('atividade')
            .insert(atividade)
            .then(res.status(204).send())
            .catch(err => res.status(500).send(err))

    }

    const update = async (req, res) => {
        const atividade = { ...req.body }
        if(req.params.id) atividade.id = req.params.id

        try{
            existsOrError(atividade.id,'ID da atividade não informada')
            existsOrError(atividade.name,'Nome da atividade não informada')
            existsOrError(atividade.dataIni,'Data Início não informada')
            existsOrError(atividade.dataFim,'Data Término não informada')
            existsOrError(atividade.idProjeto,'ID do projeto não informado')
            dateError(atividade.dataIni, atividade.dataFim, 'Data de Término não pode ser infeior a Data de Início')

        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(atividade.id){
            app.db('atividade')
                .update(atividade)
                .where({id: atividade.id})
                .then(res.status(204).send())
                .catch(err => res.status(500).send(err))
        } 
    }


    const get = (req, res) => {
        app.db('atividade')
            .select('id', 'name', 'dataIni', 'dataFim', 'finalizada', 'idProjeto').orderBy('id')
            .where({idProjeto: req.params.id})
            .then(atividade => res.json(atividade))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
       
        try {

            const deleteAtividade = await app.db('atividade')
                .where({id: req.params.id})
                .del()            
                existsOrError(deleteAtividade,'Não foi possível excluir esta atividade')
                res.status(204).send()
                
        }  catch (msg){
            res.status(400).send(msg)
        }    
    }

    return { insert, update , get, remove }
}