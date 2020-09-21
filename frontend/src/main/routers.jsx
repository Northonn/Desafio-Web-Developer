import React from 'react'
import {Switch, Route, Redirect} from 'react-router'

import Home from '../components/home/Home'
import ProjetoCrud from '../components/Projetos/ProjetoCrud'
import AtividadesCrud from '../components/Atividades/AtividadesCrud'

export default props =>
    <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route path='/Projetos' component={ProjetoCrud}></Route>
        <Route path='/Atividades/:idProjeto' component={AtividadesCrud}></Route>
        <Redirect from='*' to='/'></Redirect>
    </Switch>