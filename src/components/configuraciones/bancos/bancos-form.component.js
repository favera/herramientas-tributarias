import React, {Component} from 'react';
import axios from 'axios';
import {UserLogueado} from '../../../App';
const configData = require('../../../config.json');

export default class BancosForm extends Component{
    constructor(props){        
        super(props);
        this.state = {  
            descripcion:'',
            user_created:'',
            user_updated:'',
            textButton:'Agregar',
            idUpdate: 'NEW'
        };        
    }

    //Metodo que obtiene cualquier actualizacion de otros componentes donde fue llamado
    componentDidUpdate(){               
        if(this.state.idUpdate !== this.props.idUpdate ){
            this.setState({ idUpdate: this.props.idUpdate});
            if(this.props.idUpdate !== "NEW" && this.props.idUpdate !== "" ){
                axios.get(configData.serverUrl + "/bancos/"+this.props.idUpdate)
                .then(response => {
                    this.setState({
                        descripcion: response.data.descripcion,
                        user_created: UserLogueado.nick,
                        textButton:'Actualizar'
                    })
                })
                .catch(err => console.log(err));
            }else{
                this.setState({
                    descripcion:'',
                    user_created: UserLogueado.nick,
                    user_updated: UserLogueado.nick,
                    textButton:'Agregar',
                    idUpdate: this.props.idUpdate
                });
            }
        }
    }

    //Metodo que se ejecuta antes del render
    componentDidMount(){}
    
    onChangeDescripcion = (e) => {
        this.setState({
            descripcion: e.target.value
        })
    }
    
    showNotification(isSuccess){
        document.querySelector('#alert').classList.replace('hide','show');
        if(isSuccess === true){
            document.querySelector('#alert').classList.replace('alert-warning','alert-success');
            document.querySelector('#alert #text').innerHTML = '<strong>Exito!</strong> Los datos han sido actualizados.'
        }else{
            document.querySelector('#alert').classList.replace('alert-success','alert-warning');
            document.querySelector('#alert #text').innerHTML = '<strong>Error!</strong> Contacte con el administrador.'
        }
        //Enfocar el input
        this._input.focus(); 
        //actualizar Lista
        this.props.onUpdateParentList('true');
        setTimeout(function(){  document.querySelector('#alert').classList.replace('show','hide'); }, 3000);
    }

    handleCloseAlert = () =>{
        document.querySelector('#alert').classList.replace('show','hide');
    }
    
    onSubtmit = (e) => {
        e.preventDefault();
        if(this.props.idUpdate === "NEW" || this.props.idUpdate === "" ){
            const banco = {
                descripcion: this.state.descripcion,
                user_created: this.state.user_created,
                user_updated: this.state.user_updated
            }
            axios.post(configData.serverUrl + '/bancos/add',banco)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false));
            this.setState({
                descripcion:'',
                user_created:'',
                user_updated:'',
                textButton:'Agregar',
                idUpdate:'NEW'
            })       
        }else{
            const banco = {
                descripcion: this.state.descripcion,
                user_updated: UserLogueado.nick
            }
            axios.post(configData.serverUrl + '/bancos/update/'+this.state.idUpdate,banco)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false));
        }
    }   
    
    render(){          
        return(
            <div className="container"> 
                <h3>Banco</h3>
                <form onSubmit={this.onSubtmit}>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label>Descripcion: </label>
                                <input type="text" 
                                    autoFocus={true}
                                    ref={c => (this._input = c)}
                                    required
                                    className="form-control"
                                    value={this.state.descripcion}
                                    onChange={this.onChangeDescripcion} 
                                />
                            </div>
                        </div>
                    <div className="form-group">
                        <input type="submit" value={this.state.textButton} className="btn btn-success" />
                    </div>        
                    <div id="alert" className="alert alert-success alert-dismissible fade hide" role="alert">
                        <span id="text"></span>
                        <button type="button" className="close" onClick={this.handleCloseAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>                                
                </form>
            </div>
        )
    }
}
