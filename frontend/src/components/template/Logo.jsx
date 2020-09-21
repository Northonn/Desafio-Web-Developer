import './Logo.css'
import React from 'react'
import logo from '../../assets/imgs/logo-do-grupo.png'

export default props => 
    <aside className="logo">
        <a href="/" className="logo" >
            <img src={logo} alt="logo" class="ml-2"/>
        </a>
    </aside>