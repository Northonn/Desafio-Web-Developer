import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import { Redirect } from 'react-router'
import ReactTooltip from 'react-tooltip'
var moment = require('moment'); // require

const headerProps = {
    icon: 'tasks',
    title: 'Projetos',
    subtitle: 'Cadastro de Projetos: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3001/projetos'
const baseUrlAti = 'http://localhost:3002/atividades'

const initialState = {
    projeto: { name: '', dataIni: '', dataFim: '' },
    list: []

}

var idRouter = ''

export default class ProjetosCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
  
        axios(baseUrl).then(resp => {
            var list = []
            for(let i of resp.data){
                axios(baseUrlAti).then(r => {

                    let filtraAtividades = obj => obj.idProjeto == i.id
                    let filtraAtividadesFinalizadas = obj => obj.finalizada
                    let dados = r.data
                    let atividadesDoProjeto = dados.filter(filtraAtividades)
                    let qtdeAtividades = atividadesDoProjeto.length

                    let atividadesFinalizadas = atividadesDoProjeto.filter(filtraAtividadesFinalizadas)
                    let qtdeAtividadesFinalizadas = atividadesFinalizadas.length
                    
                    i.progress = (qtdeAtividadesFinalizadas * 100 ) / qtdeAtividades
                    list.push(i);

                    this.setState({ list: list })
                }).catch(console.log)
            }
        }).catch(console.log)
   
    }

    clear() {
        this.setState({ projeto: initialState.projeto })
    }

    save() {
        const projeto = this.state.projeto
        const method = projeto.id ? 'put' : 'post' // Se o ID estiver definido usa put para alterar, caso contrario usa  post para incluir
        const url = projeto.id ? `${baseUrl}/${projeto.id}` : baseUrl
        axios[method](url, projeto).then(resp => {
            const list = this.getUpdateList(resp.data)
            this.setState({ projeto: initialState.projeto, list })
        }).catch(console.log)
    }

    getUpdateList(projeto, add = true) {
        const list = this.state.list.filter(p => p.id != projeto.id)
        if (add)
            list.unshift(projeto)
        return list
    }

    updateField(event) {
        const projeto = { ...this.state.projeto }
        projeto[event.target.name] = event.target.value
        this.setState({ projeto })
    }

    renderForm() {
        if (this.state.redirect) {
            return <Redirect to={`/Atividades/${idRouter}`} />
        } else {
            return (
                
                <div className="form">
                    <div className="row">

                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8">
                            <div className="form-group">
                                <label>Nome do Projeto</label>
                                <input type="text" className="form-control"
                                    name="name"
                                    value={this.state.projeto.name}
                                    onChange={e => this.updateField(e)}
                                    placeholder="Digite o nome do Projeto..." />
                            </div>
                        </div>

                        <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-2">
                            <div className="form-group">
                                <label>Data Início</label>
                                <input type="Date" className="form-control"
                                    name="dataIni"
                                    value={this.state.projeto.dataIni}
                                    onChange={e => this.updateField(e)}>
                                </input>
                            </div>
                        </div>

                        <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-2">
                            <div className="form-group">
                                <label>Data Término</label>
                                <input type="Date" className="form-control"
                                    name="dataFim"
                                    value={this.state.projeto.dataFim}
                                    onChange={e => this.updateField(e)}>
                                </input>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 d-flex ">
                            <button className="btn btn-primary"
                                disabled={(!this.state.projeto.name || !this.state.projeto.dataIni || !this.state.projeto.dataFim)}
                                onClick={e => this.save(e)}>
                                Salvar
                           </button>
                           
                            <button className="btn btn-light ml-2" 
                                onClick={e => this.clear(e)}>
                                Cancelar
                           </button>                           
                        </div>
                    </div>
                </div>

            )
        }
    }

    load(projeto) {
        this.setState({ projeto })
    }

    remove(projeto) {

        axios.delete(`${baseUrl}/${projeto.id}`).then(resp => {
            const list = this.getUpdateList(projeto, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4 shadow-sm">
                <thead class="thead-light">
                    <tr>
                        <th>ID Projeto</th>
                        <th>Nome Projeto</th>
                        <th>Data Início</th>
                        <th>Data Término</th>
                        <th class="text-center">Progresso</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    addAtividades(id) {
        idRouter = id
        
        this.setState({
            redirect: true
        })

    }

    renderRows() {


        return this.state.list.map(projeto => {
            var prog = projeto.progress ? projeto.progress : 0
            var width = { width: prog + '%' }

            function statusProjeto() {
                return (moment( Date() ).diff(projeto.dataFim, 'days' ) > 0 && projeto.progress != 100)
            }
            
            return ( 
                <tr key={projeto.id}>
                    <td>{projeto.id}</td>
                    <td>{projeto.name}</td>
                    <td>{projeto.dataIni}</td>
                    <td>{projeto.dataFim}</td>
                    <td class="text-center">
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={width}  aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                    <td class="text-center">
                        <i data-tip="'V' para dentro do prazo e '!' para atrasado" className= { statusProjeto() ? "fa fa-exclamation text-danger" : "fa fa-check text-success" } aria-hidden="true"></i> 
                        <ReactTooltip place="bottom" type="info" effect="solid"/>

                    </td>
                    <td class="text-center">
                        <button className="btn btn-success" data-tip="Adicionar atividades ao projeto"
                            onClick={() => this.addAtividades(projeto.id)}>
                            <i className="fa fa-sitemap"></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                        <button data-tip="Alterar o projeto" className="btn btn-info ml-2"
                            onClick={() => this.load(projeto)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                        <button data-tip="Excluir o projeto" className={projeto.progress > 0 ? "btn btn-light ml-2" : "btn btn-danger ml-2"} 
                            disabled={projeto.progress > 0}
                            onClick={() => this.remove(projeto)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                    </td>
                </tr>

                

            )
                        
        })
    }


    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}