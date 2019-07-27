import React from 'react'
import { NavLink } from 'react-router-dom'

const navBar = props => (
    <React.Fragment>
        <nav>
            <div className="nav-wrapper">
                <NavLink to="/" className="brand-logo">BevApp</NavLink>
                <NavLink to="/" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></NavLink>
                <ul className="right hide-on-med-and-down">
                    <li><NavLink to="/">Only Mobile</NavLink></li>
                </ul>
            </div>
        </nav>
        <ul className="sidenav" id="mobile-demo">    
            <li>
                <div className="divider"></div>
            </li>
            <li><NavLink to="/" className="sidenav-close"><i className="material-icons">shopping_cart</i>Bevásárlólisták</NavLink></li>
            <li>
                <div className="divider"></div>
            </li>
        </ul>
    </React.Fragment>
)

export default navBar;