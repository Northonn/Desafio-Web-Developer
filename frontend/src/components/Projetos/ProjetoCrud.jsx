
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

const urlGetQtdeAtividade = 'http://localhost:3001/getQtdeAtividade'
const urlGetQtdeAtividadeFinalizadas = 'http://localhost:3001/getQtdeAtividadeFinalizadas'

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
            for (let i of resp.data) {

                let qtdeAtividades = 0
                let qtdeAtividadesFinalizadas = 0

                axios(`${urlGetQtdeAtividade}/${i.id}`).then(resp => {
                    qtdeAtividades = resp.data.QtdeAtividade
                    axios(`${urlGetQtdeAtividadeFinalizadas}/${i.id}`).then(resp => {
                        qtdeAtividadesFinalizadas = resp.data.QtdeAtividadeFinalizadas
                        i.progresso = Math.floor((qtdeAtividadesFinalizadas * 100) / qtdeAtividades, 2)
                        list.push(i);
                        this.setState({ list: list })
                    }).catch(resp => alert(resp.response.data))
                }).catch(resp => alert(resp.response.data))
            }
        }).catch(resp => alert(resp.response.data))
    }

    save() {
        const projeto = this.state.projeto
        const method = projeto.id ? 'put' : 'post' // Se o ID estiver definido usa put para alterar, caso contrario usa  post para incluir
        const url = projeto.id ? `${baseUrl}/${projeto.id}` : baseUrl
        axios[method](url, projeto).then(resp => {
            this.setState({ projeto: initialState.projeto })
            this.componentWillMount()
        }).catch(resp => alert(resp.response.data))
    }

    delete(projeto) {
        axios.delete(`${baseUrl}/${projeto.id}`).then(resp => {
            this.getUpdateList()
        }).catch(resp => alert(resp.response.data))
    }

    getUpdateList() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })

        }).catch(resp => alert(resp.response.data))
    }

    load(projeto) { 
        this.setState({ projeto })
    }

    updateField(event) {
        const projeto = { ...this.state.projeto }
        projeto[event.target.name] = event.target.value
        this.setState({ projeto })
    }

    clear() { 
        this.setState({ projeto: initialState.projeto })
    }

    addAtividades(id) {
        idRouter = id

        this.setState({
            redirect: true
        })
    }

    renderForm() {
        const dtIni = moment(this.state.projeto.dataIni).format('YYYY-MM-DD')
        const dtFim = moment(this.state.projeto.dataFim).format('YYYY-MM-DD')
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
                                    value={dtIni}
                                    onChange={e => this.updateField(e)}>
                                </input>
                            </div>
                        </div>

                        <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-2">
                            <div className="form-group">
                                <label>Data Término</label>
                                <input type="Date" className="form-control"
                                    name="dataFim"
                                    value={dtFim}
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
                                onClick={e => {
                                    this.clear(e)
                                }}>
                                Cancelar
                           </button>                       
                            
                        </div>
                    </div>
                </div>
            )
        }
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

    renderRows() {
        return this.state.list.map(projeto => {
            let borderSize = { height: 8 + 'px' };
            var width = { width: projeto.progresso + '%' }

            function statusProjeto(pProjeto) {
                return (moment(Date()).diff(pProjeto.dataFim, 'days') > 0 && pProjeto.progresso != 100)
            }

            function labelProgresso(pProjeto) {
                return isNaN(pProjeto.progresso) ? 0 : pProjeto.progresso
            }

            return (
                <tr key={projeto.id}>
                    <td><div className="mt-3">{projeto.id}</div></td>
                    <td><div className="mt-3">{projeto.name}</div></td>
                    <td><div className="mt-3">{moment(projeto.dataIni).format('DD/MM/YYYY')}</div></td>
                    <td><div className="mt-3">{moment(projeto.dataFim).format('DD/MM/YYYY')}</div></td>
                    <td >
                        <div class="align-self-end text-right mt-2">
                            {labelProgresso(projeto)}%
                        </div>
                        <div class="progress" style={borderSize}>
                            <div class="progress-bar progress-bar-striped progress-bar-animated " role="progressbar" style={width} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                    <td class="text-center">
                        <div className="mt-3">
                            {statusProjeto(projeto)?'Atrasado':'No Prazo'}
                        </div>

                    </td>
                    <td class="text-center">
                        <div className="mt-2">
                            <button className="btn btn-light" data-tip="Atividades do Projeto"
                                onClick={() => this.addAtividades(projeto.id)}>
                                <i className="fa fa-sitemap"></i>
                            </button>
                            <ReactTooltip place="bottom" type="info" effect="solid" />
                            <button data-tip="Editar Projeto" className="btn btn-light ml-2"
                                onClick={() => this.load(projeto)}>
                                <i className="fa fa-pencil"></i>
                            </button>
                            <ReactTooltip place="bottom" type="info" effect="solid" />
                            <button data-tip="Excluir Projeto" className="btn btn-light ml-2"

                                onClick={() => this.delete(projeto)}>
                                <i className="fa fa-trash-o"></i>
                            </button>
                            <ReactTooltip place="bottom" type="info" effect="solid" />
                        </div>
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