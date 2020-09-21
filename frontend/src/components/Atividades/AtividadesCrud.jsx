import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import { Redirect } from 'react-router'
import ReactTooltip from 'react-tooltip'


const headerProps = {
    icon: 'sitemap',
    title: 'Atividades',
    subtitle: 'Cadastro de Atividades de Projetos: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3002/atividades'
const baseUrlPro = 'http://localhost:3001/projetos'


const initialState = {
    atividade: { name: '', dataIni: '', dataFim: '', finalizada: '', idProjeto: '' },
    projeto: { name: '', dataIni: '', dataFim: '', id: '' },
    list: [],
    listPro: []

}

let progresso = 0

export default class AtividadesCrud extends Component {

    state = { ...initialState }

    componentWillMount() {

        axios(baseUrl).then(resp => {

            const filtraProjeto = obj => obj.idProjeto == this.props.match.params.idProjeto
            const dados = resp.data
            const projetoUnico = dados.filter(filtraProjeto)
            let filtraAtividadesFinalizadas = obj => obj.finalizada
            let qtdeAtividades = projetoUnico.length
            let atividadesFinalizadas = projetoUnico.filter(filtraAtividadesFinalizadas)
            let qtdeAtividadesFinalizadas = atividadesFinalizadas.length

            progresso = (qtdeAtividadesFinalizadas * 100) / qtdeAtividades

            this.setState({ list: projetoUnico })

            axios(baseUrlPro).then(resp => {

                const filtraProjeto1 = obj => obj.id == this.props.match.params.idProjeto
                const dados1 = resp.data
                const dados2 = dados1.filter(filtraProjeto1)
                dados2[0].progress = progresso
                this.setState({ projeto: dados2[0] })
            })
        })
    }

    clear() {
        this.setState({ atividade: initialState.atividade })
    }

    confirmar(ativ) {
        ativ.finalizada = true
        const atividade = ativ

        const method = atividade.id ? 'put' : 'post' // Se o ID estiver definido usa put para alterar, caso contrario usa  post para incluir
        const url = atividade.id ? `${baseUrl}/${atividade.id}` : baseUrl
        axios[method](url, atividade).then(resp => {
            const list = this.getUpdateList(resp.data)
            this.setState({ atividade: initialState.atividade, list })
        })
        window.location.reload();
    }

    save() {
        const atividade = this.state.atividade
        atividade.idProjeto = this.state.projeto.id
        const method = atividade.id ? 'put' : 'post' // Se o ID estiver definido usa put para alterar, caso contrario usa  post para incluir
        const url = atividade.id ? `${baseUrl}/${atividade.id}` : baseUrl
        axios[method](url, atividade).then(resp => {
            const list = this.getUpdateList(resp.data)
            this.setState({ atividade: initialState.atividade, list })
        })
        window.location.reload();
    }

    getUpdateList(atividade, add = true) {
        const list = this.state.list.filter(p => p.id !== atividade.id)
        if (add)
            list.unshift(atividade)
        return list
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

    remove(atividade) {
        axios.delete(`${baseUrl}/${atividade.id}`).then(resp => {
            const list = this.getUpdateList(atividade, false)
            this.setState({ list })
        })
    }

    renderHeader() {
        var prog = this.state.projeto.progress >=0 ? Math.floor(this.state.projeto.progress,2) : 0
        let styleRed = { width: this.state.projeto.progress + '%' };
        let borderSize = { height: 2 + 'px' };
        if (this.state.redirect) {
            return <Redirect to="/Projetos" />
        } else {

            return (
                <div className="form">
                    <div className="row pb-2">
                        <div className="col-8 col-sm-8 col-md-9 col-lg-10 col-xl-11">
                            <div className="form-group">
                                <h1>{this.state.projeto.name}</h1>
                                {this.state.projeto.dataIni} a {this.state.projeto.dataFim}
                            </div>
                        </div>

                        <div className="align-self-end text-right col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">                            
                             <h1>{prog + '%'}</h1>
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
                            value={this.state.atividade.dataIni}
                            onChange={e => this.updateField(e)}>
                        </input>
                    </div>
                </div>
                <div className="col-3 col-sm-6 col-md-6 col-lg-6 col-xl-2">
                    <div className="form-group">
                        <label>Data Término</label>
                        <input type="Date" className="form-control"
                            name="dataFim"
                            value={this.state.atividade.dataFim}
                            onChange={e => this.updateField(e)}>
                        </input>
                    </div>
                </div>

                <input type="checkbox" class="custom-control-input invisible" id="finalizada" name="finalizada"
                    checked={this.state.atividade.finalizada}
                    onChange={e => this.updateField(e)}
                />
            </div>
        )
    }

    renderButtons() {
        return (
            <div className="row m-2">
                <div className="col-12 d-flex ">
                    <button className="btn btn-primary"
                        disabled={(!this.state.atividade.name || !this.state.atividade.dataIni || !this.state.atividade.dataFim)}
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
                    <td>{atividade.id}</td>
                    <td>{atividade.idProjeto}</td>
                    <td>{atividade.name}</td>
                    <td class="text-center">{atividade.dataIni}</td>
                    <td class="text-center">{atividade.dataFim}</td>
                    <td class="text-center">
                        <div class="custom-control">
                            <i data-tip="'V' para Finalizada  'O' para em progresso " className={atividade.finalizada ? "fa fa-check text-success" : "fa fa-spinner"}></i>
                        </div>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>

                    </td>
                    <td class="text-center">
                        <button data-tip="Finaliza a Atividade" className={atividade.finalizada ? "btn btn-light ml-2" : "btn btn-success ml-2"}
                            disabled={atividade.finalizada}
                            onClick={e => this.confirmar(atividade)}>
                            <i className="fa fa-check "></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                        <button data-tip="Alterar a atividade" className={atividade.finalizada ? "btn btn-light ml-2" : "btn btn-info ml-2"}
                            disabled={atividade.finalizada}
                            onClick={() => this.load(atividade)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <ReactTooltip place="bottom" type="info" effect="solid"/>
                        <button data-tip="Excluir a atividade" className={atividade.finalizada ? "btn btn-light ml-2" : "btn btn-danger ml-2"}
                            disabled={atividade.finalizada}
                            onClick={() => this.remove(atividade)}>
                            <i className="fa fa-trash"></i>
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