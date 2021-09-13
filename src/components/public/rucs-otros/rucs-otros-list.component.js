import React, {Component} from 'react';
import axios from 'axios';
import TimbradosList from '../timbados/timbrado-list.component';
import { UserLogueado } from '../../../App';
const configData = require('../../../config.json');

export default class RucsOtrosList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            idUpdate: '',
            timbradotitle: '',
            isToggled: false,
            user: [],
            formSelected: 'FormRucs'
        }
        this.datalist = this.datalist.bind(this);
        this.getFormulario = this.getFormulario.bind(this);
    }

    updateList = async (value) => {
        await axios.get(configData.serverUrl + "/rucs/other/"+UserLogueado.id)
            .then(response => {
                this.setState({
                    datos: response.data
                })
            })
            .catch(err => console.log(err))

        console.log("Lenght datos",this.state.datos.length)

    }    
    componentDidMount(){
        this.updateList('true');
    }
    componentDidUpdate(){ 
        window.paginar('list-group','list-group-item');
    }

    deleteData = (jsondatos) => {
        axios.delete(configData.serverUrl + "/rucs/"+jsondatos._id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        this.setState({
            datos: this.state.datos.filter(el => el._id !== jsondatos._id)
        })
    }

    updateData = (jsondatos) => {
        this.setState({
            idUpdate: jsondatos._id,
            formSelected: "FormRucs"
        })
    }

    createData = (id) => {
        this.setState({
            idUpdate: id,
            formSelected: "FormRucs"
        })
    }
    onChangeFormTimbrado = (jsondatos) =>{
        this.setState({
            idUpdate: jsondatos._id,
            timbradotitle: jsondatos.ruc+"-"+jsondatos.div+" "+jsondatos.razonSocial,
            formSelected: "FormTimbrado"
        })
    }
    getFormulario(){
        if(this.state.formSelected === "FormRucs"){
            return ("");
        }else{
            return (<TimbradosList ruc={this.state.idUpdate} title={this.state.timbradotitle}/>)
        }
    }

    datalist(){
        return this.state.datos.map((dato,index) => {
            return (<li className="list-group-item" key={"otros-"+index}>                   
                    <div className="col-md-4">{dato.ruc +"-"+dato.div+" "+dato.razonSocial}</div>
                    <div className="col-md-5">{dato.tipoEgreso.descripcion}</div>
                    <div className="col-md-3 text-right">
                        <button onClick={() => this.onChangeFormTimbrado(dato)} type="button" className="btn btn-light btn-sm mr-1">Timbrados</button>
                    </div>
                </li>)
        })
    }
    render(){       
        return(
            <div className="container">
                <div className="row mb-0 col-md-8">
                    <div className="col-md-6">
                        <h3>Rucs de Otros</h3>
                    </div>
                    <div className="col-md-6">
                        <input type="text" 
                                    required                                    
                                    className="form-control"
                                    value={this.state.razonSocial}
                                    onChange={this.onChangeRazonSocial}
                                />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-4">Ruc - Razon Social</div>
                                    <div className="col-md-4">Tipo Egreso Predeterminado</div>   
                                    <div className="col-md-4 text-right">
                                    </div>                                 
                                </div>
                            </div>
                            <input className="input-search form-control" type="search" placeholder="Busqueda (minimo 3 letras)..." />
                            <ul id="list" className="list-group">
                                {this.datalist()}
                            </ul>                     
                        </div>
                    </div>
                    <div className="col-md-4">
                        {this.getFormulario()}                        
                    </div>
                </div>
            </div>
        )
    }
}