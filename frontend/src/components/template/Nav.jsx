import './Nav.css'
import React from 'react'

export default props =>
    <aside className="menu-area">
        <nav className="menu ">
            <a href="#/" class="ml-3">
                <i className="fa fa-home text-white"></i> Início
                    </a>
            <a href="#/Projetos" class="ml-3">
                <i className="fa fa-tasks text-white"></i> Projetos
                    </a>
        </nav>
    </aside>