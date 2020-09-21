import React from 'react'
import Main from '../template/Main'

export default props =>
    <Main icon="home" title="Inicio" subtitle="Desafio Web Developer">
        <div className="display-4">Bem Vindo!</div>
        <hr />
        <p className="nm-0">
            Sistema para criar criar um cadastro de projetos com a data de início e data final para a entrega, esse projeto pode ter 1 ou N atividades que também precisam ser cadastradas com as datas de início e data de fim. Após ter feito todos os cadastros precisamos saber quantos % dos projetos já temos finalizados e também se o projeto terá atrasos ou não. Para saber a % de andamento do projeto deve ser considerado o número de atividades finalizadas e quantidade de atividades ainda sem finalizar. Para saber se o projeto terá atraso considere a maior data final das atividades e compare com a data final do projeto, se for maior que a data final, o projeto terminará com atrasos. Abaixo segue exemplo das tabelas para cadastros.
        </p>
    </Main>
