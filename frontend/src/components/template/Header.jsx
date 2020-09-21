import './Header.css'
import React from 'react'

export default props =>
    <header className="header d-nome d-sm-flex flex-column"> 
        <h1 className="mt-4 text-white" >
            <i className={`text-white fa fa-${props.icon}`}></i> {props.title}
        </h1>
        <p className="lead text-white">{props.subtitle}</p>
    </header>
    