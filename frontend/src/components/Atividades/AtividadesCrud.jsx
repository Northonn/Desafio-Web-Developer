import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import { Redirect } from 'react-router'
import ReactTooltip from 'react-tooltip'
var moment = require('moment'); // require


const headerProps = {
    icon: 'sitemap',
    title: 'Atividades',
    subtitle: 'Cadastro de Atividades de Projetos: Incluir, Listar, Alterar e Excluir'
}

const baseUrlAti = 'http://localhost:3001/atividades'
const baseUrlPro = 'http://localhost:3001/projetos'

const urlGetQtdeAtividade = 'http://localhost:3001/getQtdeAtividade'
const urlGetQtdeAtividadeFinalizadas = 'http://localhost:3001/getQtdeAtividadeFinalizadas'


const initialState = {
    atividade: { name: '', dataIni: '', dataFim: '', finalizada: '', idProjeto: '' },
    projeto: { name: '', dataIni: '', dataFim: '', id: '', progresso: 0 },
    list: []

}

export default class AtividadesCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        const urlPro = `${baseUrlPro}/${this.props.match.params.idProjeto}`

        axios(urlPro).then(resp => {
            this.setState({ projeto: resp.data })
            const urlAti = `${baseUrlAti}/${this.props.match.params.idProjeto}`
            axios(urlAti).then(resp => {
                this.setState({ list: resp.data })
                this.getUpdateProgress()
            }).catch(resp => alert(resp.response.data))           
        }).catch(resp => alert(resp.response.data))
        
    }

    getUpdateProgress(){
        const urlQtdeAti = `${urlGetQtdeAtividade}/${this.props.match.params.idProjeto}`
        const urlQtdeAtiFin = `${urlGetQtdeAtividadeFinalizadas}/${this.props.match.params.idProjeto}`
        let qtdeAtividades = 0
        let qtdeAtividadesFinalizadas = 0
        let aux = 0

        axios(urlQtdeAti).then(resp => {
            qtdeAtividades = resp.data.QtdeAtividade
            axios(urlQtdeAtiFin).then(resp => {
            qtdeAtividadesFinalizadas = resp.data.QtdeAtividadeFinalizadas 
            aux = Math.floor((qtdeAtividadesFinalizadas * 100) / qtdeAtividades,2)
            this.state.projeto.progresso = isNaN(aux) ? 0 : aux
            this.setState([])
            }).catch(resp => alert(resp.response.data))          
        }).catch(resp => alert(resp.response.data))
    }

    clear() {
        this.setState({ atividade: initialState.atividade })
    }

    confirmar(ativ) {
        const atividade = ativ
        const idProjeto = atividade.idProjeto

        atividade.idProjeto = idProjeto
        atividade.finalizada = !ativ.finalizada
        
        const method = 'put'
        const url = atividade.id ? `${baseUrlAti}/${idProjeto}/${atividade.id}` : `${baseUrlAti}/${idProjeto}`
        
        axios[method](url, atividade).then(resp => {
            this.getUpdateList();
            this.setState({ atividade: initialState.atividade })
        }).catch(resp => alert(resp.response.data))
    }

    save() {
        const atividade = this.state.atividade
        const idProjeto = this.state.projeto.id

        atividade.idProjeto = idProjeto
        atividade.finalizada = atividade.id ? this.state.atividade.finalizada : false
        
        const method = atividade.id ? 'put' : 'post' // Se o ID estiver definido usa put para alterar, caso contrario usa  post para incluir
        const url = atividade.id ? `${baseUrlAti}/${idProjeto}/${atividade.id}` : `${baseUrlAti}/${idProjeto}`

        axios[method](url, atividade).then(resp => {
            this.getUpdateList();
            this.setState({ atividade: initialState.atividade })
        }).catch(resp => alert(resp.response.data))
    }

    delete(atividade) {
        axios.delete(`${baseUrlAti}/${this.state.projeto.id}/${atividade.id}`).then(resp => {
            this.getUpdateList()
        }).catch(resp => alert(resp.response.data))
    }    
    
    getUpdateList() {
        const url = `${baseUrlAti}/${this.state.projeto.id}`
        axios(url).then(resp => {
            this.getUpdateProgress()
            this.setState({ list: resp.data })
        }).catch(resp => alert(resp.response.data))
    }

    updateField(event) {
        const atividade = { ...this.state.atividade }
        const value = event.target.type == 'checkbox' ? event.target.checked : event.target.value;

        atividade[event.target.name] = value
        this.setState({ atividade })
    }

    load(atividade) {
        this.setState({ atividade })
    }

    renderHeader() {
        let borderSize = { height: 2 + 'px' };
        let styleRed = { width: 0 + '%' };
        if (!isNaN(this.state.projeto.progresso))
            styleRed = { width: this.state.projeto.progresso + '%' };

        if (this.state.redirect) {
            return <Redirect to="/Projetos" />
        } else {

            return (
                <div className="form">
                    <div className="row pb-2">
                        <div className="col-8 col-sm-8 col-md-9 col-lg-10 col-xl-11">
                            <div className="form-group">
                                <h1>{this.state.projeto.name}</h1>
                                {moment(this.state.projeto.dataIni).format('DD/MM/YYYY')} a {moment(this.state.projeto.dataFim).format('DD/MM/YYYY')}
                            </div>
                        </div>

                        <div className="align-self-end text-right col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">                            
                             <h1>{isNaN(this.state.projeto.progresso) ? 0+'%' : this.state.projeto.progresso+'%'}</h1>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="form-group">
                                <div class="progress shadow-sm" style={borderSize}>
                                    <div class="progress-bar" role="progressbar" style={styleRed} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }
    }

    renderFields() {
        const dtIni = moment(this.state.atividade.dataIni).format('YYYY-MM-DD')
        const dtFim = moment(this.state.atividade.dataFim).format('YYYY-MM-DD')

        return (
            <div className="row mt-3 m-2">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8">
                    <div className="form-group">
                        <label>Nome da Atividade</label>
                        <input type="text" className="form-control"
                            name="name"
                            value={this.state.atividade.name}
                            onChange={e => this.updateField(e)}>
                        </input>
                        <input type="hidden" className="form-control"
                            name="idProjeto"
                            value={this.state.atividade.idProjeto}
                        >
                        </input>
                    </div>
                </div>
                <div className="col-3 col-sm-6 col-md-6 col-lg-6 col-xl-2">
                    <div className="form-group">
                        <label>Data Início </label>
                        <input type="Date" className="form-control"
                            name="dataIni"
                            value={dtIni}
                            onChange={e => this.updateField(e)}>
                        </input>
                    </div>
                </div>
                <div className="col-3 col-sm-6 col-md-6 col-lg-6 col-xl-2">
                    <div className="form-group">
                        <label>Data Término</label>
                        <input type="Date" className="form-control"
                            name="dataFim"
                            value={dtFim}
                            onChange={e => this.updateField(e)}>
                        </input>
                    </div>
                    <input type="checkbox" class="custom-control-input" id="finalizada" name="finalizada"
                    checked={this.state.atividade.finalizada}
                    onChange={e => this.updateField(e)}
                />
                </div>

            </div>
        )
    }

    renderButtons() {
        return (
            <div className="row m-2">
                <div className="col-12 d-flex ">
                    <button className="btn btn-primary"
                        /*disabled={(!this.state.atividade.name || !this.state.atividade.dataIni || !this.state.atividade.dataFim)}*/
                        onClick={e => this.save(e)}>
                        Salvar
                </button>

                    <button className="btn btn-light shadow-sm ml-2 "
                        onClick={e => this.clear(e)}>
                        Cancelar
                </button>
                </div>
            </div>
        )
    }

    renderTable() {
        return (
            <div className="mt-4 mx-4">
            <table className="table table-hover shadow-sm">
                <thead class="thead-light">
                    <tr>
                        <th>ID Atividade</th>
                        <th>ID Projeto</th>
                        <th>Nome Atividade</th>
                        <th class="text-center">Data Início</th>
                        <th class="text-center">Data Término</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
            </div>
        )
    }

    routerProjeto() {
        this.setState({
            redirect: true
        })

    }

    renderRows() {
        return this.state.list.map(atividade => {
            return (
                <tr key={atividade.id}>
                    <td><div className="mt-2">{atividade.id}</div></td>
                    <td><div className="mt-2">{atividade.idProjeto}</div></td>
                    <td><div className="mt-2">{atividade.name}</div></td>
                    <td class="text-center"><div className="mt-2">{moment(atividade.dataIni).format('DD/MM/YYYY')}</div></td>
                    <td class="text-center"><div className="mt-2">{moment(atividade.dataFim).format('DD/MM/YYYY')}</div></td>
                    <td class="text-center">
                        <div class="custom-control mt-2">
                            <i data-tip={!atividade.finalizada ? "Pendente" : "Finalizada"} aria-hidden="true" className={atividade.finalizada ? "fa fa-star" : "fa fa-star-o"}></i>
                        </div>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>

                    </td>
                    <td class="text-center">
                        <button data-tip="Altera o Status" className="btn btn-light ml-2"
                            onClick={e => this.confirmar(atividade)}>
                            <i className={!atividade.finalizada ? "fa fa-star" : "fa fa-star-o"}></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                        <button data-tip="Editar atividade" className="btn btn-light ml-2"
                            onClick={() => this.load(atividade)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                        <button data-tip="Excluir atividade" className="btn btn-light ml-2"
                            onClick={() => this.delete(atividade)}>
                            <i className="fa fa-trash-o"></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                    </td>
                </tr>
            )
        })
    }

    renderFooter() {
        return (
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
                    <div className="form-group mt-3 mr-4">

                        <button className="btn btn-primary"
                            onClick={() => this.routerProjeto()}>
                            Finalizar
                    </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderHeader()}
                {this.renderFields()}
                {this.renderButtons()}
                {this.renderTable()}
                {this.renderFooter()}
            </Main>
        )
    }
}