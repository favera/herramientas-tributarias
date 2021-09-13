import React, {useState, useRef }  from 'react';
import {CSSTransition} from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faChevronRight, faChevronLeft, faCopy, faSignOutAlt, faUser, faFileAlt, faUserTag, faExclamation } from '@fortawesome/free-solid-svg-icons'
import useOutsideClick from "../../useOutsideClick";
import useToken from './useToken.js';
import logout from '../public/registration/logout';
import Switch from './switch-toggle.component.js';
import {getStylesDark, cleanStylesDark} from '../../js/activarThemeDark.js'
import {UserLogueado} from '../../App';
import {ExportData} from './export/export_data_excel';
const configData = require('../../config.json');


function DropdownMenuPublic(){
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState();
    const {theme} = useToken(); 
    const [isToggled, setIsToggled] = useState(theme === "dark");
    const ref = useRef();    
    const username = UserLogueado.name;
    const expira = UserLogueado.expira;

    if(isToggled){
        localStorage.setItem('theme', JSON.stringify({theme:"dark"}));    
        getStylesDark();
    }else{
        localStorage.setItem('theme', JSON.stringify({theme:"ligth"}));
        cleanStylesDark();
    }

    function calcHeight(el){
        const height = el.offsetHeight + 30;
        setMenuHeight(height);
    }

    function DropdownItem(props){
        if(props.clase === "menu-item-cuenta"){
            return(
                <div className={props.clase}>
                    {props.children}                      
                </div>
            )
        }
        if(props.clase === "menu-item-logout"){
            return(
                <a href={props.href ? props.href : "#"} className="menu-item" onClick={() => logout()}>        
                    {props.children}  
                </a>                                   
            )
        }
        return(
            <a href={props.href ? props.href : "#"} className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>        
                {props.children}  
            </a>
        );
    }
    useOutsideClick(ref, () => {document.getElementById("dropConf").click();});

    return(
        <div className="dropdown" style={{height: menuHeight}}  ref={ref}>
            <CSSTransition                         
            in={activeMenu === 'main'} 
            unmountOnExit
            timeout={500}
            classNames="menu-primary"
            onEnter={calcHeight}            
            >
                <div className="menu">
                    <DropdownItem clase="menu-item-cuenta">
                        <span className="icon-button"><FontAwesomeIcon icon={faUser} /></span><br />
                        {username}
                        {expira &&
                            <div className="alert alert-danger expiration-account" role="alert">
                                <FontAwesomeIcon icon={faExclamation} /> Su cuenta expira el {expira}
                            </div>
                        }
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem href="/informante">
                        <span className="icon-button">
                            <FontAwesomeIcon icon={faUserTag} />
                        </span>
                        Informante
                    </DropdownItem>
                    <DropdownItem goToMenu="formularios">
                        <span className="icon-button">
                            <FontAwesomeIcon icon={faCopy} />
                        </span>
                        {configData.Lenguajes_es.m003}
                        <span className="icon-right">
                            <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                    </DropdownItem>                    
                    <DropdownItem clase="menu-item-darkteme">
                        <Switch idToggle="check_theme" isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)} />Tema Oscuro
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem clase="menu-item-logout">
                        <span className="icon-button">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </span>
                        {configData.Lenguajes_es.m005}
                        </DropdownItem>
                </div>
            </CSSTransition>
            <CSSTransition 
            in={activeMenu === 'formularios'} 
            unmountOnExit
            timeout={500}
            classNames="menu-secondary"
            onEnter={calcHeight}
            >
                <div className="menu">
                    <DropdownItem goToMenu="main" >
                        <span className="icon-button"><FontAwesomeIcon icon={faChevronLeft}/></span>                
                    </DropdownItem>
                    <DropdownItem href="/rucs"><span className="icon-button"><FontAwesomeIcon icon={faFileAlt} /></span>Lista de Rucs</DropdownItem>                    
                    <DropdownItem><span className="icon-button"><FontAwesomeIcon icon={faCog} /></span>Formulario 2</DropdownItem>
                    
                </div>
            </CSSTransition>
        </div>
    );
}

function NavbarPublic(props){
    return(
        <nav className="navbar">
            <ul className="navbar-nav">{ props.children }</ul>
        </nav>
    )
}

function NavItemPublic(props){
    const [open, setOpen] = useState(false);
    const expira = UserLogueado.expira;
    var varid = (props.id  ? {id:props.id} : '');
    
    if(props.class === 'nav-item-logo'){
        return (
            <li className="nav-item-logo">
                <a href="/" className="icon-logo" >
                    <img alt="" src={props.image} />
                    {configData.LogoText}
                </a>                
            </li>
        )
    }
    if(props.class === 'nav-item-informante'){
        return (
            <li className="nav-item-informante">
                <a href="/informante"><b>Informante: </b><span></span></a>
            </li>
        )
    }   
    
    if(props.id === 'dropConf'){
        return (
            <li className="nav-item">
                <a {...varid}  href="#" className={expira ? "icon-button expiration" : "icon-button"} onClick={() => setOpen(!open)}>
                    <FontAwesomeIcon icon={ props.icon }  />
                </a>
                {open && props.children }
            </li>
        )
    } 
    if(props.class === 'nav-item-export'){ 
        return (
            <li className="nav-item-export">
                <ExportData reload={true}/>
            </li>
        )
    }

    return (
        <li className="nav-item">
            <a {...varid}  href="#" className="icon-button" onClick={() => setOpen(!open)}>
                <FontAwesomeIcon icon={ props.icon }  />
            </a>
            {open && props.children }
        </li>
    )
}

export {DropdownMenuPublic,NavbarPublic,NavItemPublic}