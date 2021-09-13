import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserLogueado } from '../../../App';
import ReactExport from 'react-data-export';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const configData = require('../../../config.json');


async function getDataSet(){
    let user = await axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id).then(r => r.data).catch(e => undefined);
    let ingresos = await axios.get(configData.serverUrl + `/formularioIngreso/owner/${UserLogueado.id}/${user.informante}/${user.periodo}`).then(r => r.data).catch(e => undefined);
    
    //Si no contiene datos no exporta
    if(ingresos.length === 0 )return null;

    /*Codigo Tipos de Registro*/
    const codigoTipoRegistro_Ingreso = "1";

    let columns = [
        {title: codigoTipoRegistro_Ingreso, style:{}},
        {title: ingresos[0].identificacionCodigo, style:{}},
        {title: ingresos[0].ruc, style:{}},
        {title: ingresos[0].razonSocial, style:{}},
        {title: ingresos[0].comprobanteTipoCodigo, style:{}},
        {title: ingresos[0].fechaEmision, style:{}},
        {title: ingresos[0].informanteTimbrado, style:{}},
        {title: ingresos[0].comprobanteNumero, style:{}},
        {title: ingresos[0].iva10Incluido, style:{}},
        {title: ingresos[0].iva5Incluido, style:{}},
        {title: ingresos[0].excentas, style:{}},
        {title: ingresos[0].montoVenta, style:{}},
        {title: ingresos[0].condicionCodigo, style:{}},
        {title: (ingresos[0].monedaExtranjera ? "S" : "N"), style:{}},
        //{title: (ingresos[0].ImputaIVA ? "S" : "N"), style:{}},
        {title: (ingresos[0].gravadoIRE ? "S" : "N"), style:{}},
        {title: (ingresos[0].gravadoIRP ? "S" : "N"), style:{}}        
    ];    
    ingresos.splice(0,1);//Elimino la primera fila para no colocar dos veces.
    const DataSet = [
        {
            columns,
            data: ingresos.map((data) => 
                [
                    {value: codigoTipoRegistro_Ingreso, style:{}},
                    {value: data.identificacionCodigo, style:{}},
                    {value: data.ruc, style:{}},
                    {value: data.razonSocial, style:{}},
                    {value: data.comprobanteTipoCodigo, style:{}},
                    {value: data.fechaEmision, style:{}},
                    {value: data.informanteTimbrado, style:{}},
                    {value: data.comprobanteNumero, style:{}},
                    {value: data.iva10Incluido, style:{}},
                    {value: data.iva5Incluido, style:{}},
                    {value: data.excentas, style:{}},
                    {value: data.montoVenta, style:{}},
                    {value: data.condicionCodigo, style:{}},
                    {value: (data.monedaExtranjera ? "S" : "N"), style:{}},
                    //{value: (data.ImputaIVA ? "S" : "N"), style:{}},
                    {value: (data.gravadoIRE ? "S" : "N"), style:{}},
                    {value: (data.gravadoIRP ? "S" : "N"), style:{}}  
                ]
            )
            
        }
    ];
    return DataSet;
};

function ExportData(props){
    const [dataSet, setDataSet] = useState();
    const [reload, setReload] = useState(props.reload);

    useEffect(async ()=>{
        if(reload){
            setDataSet(await getDataSet());
            setReload(false);
            console.log(dataSet)
        }        
    })

    return (
        <ExcelFile
            filename="Formularios"
            element={<a href="#" className="icon-button"><FontAwesomeIcon icon={faDownload}  /></a> }
            >
                <ExcelSheet dataSet={dataSet} name="Formularios Completos" />
        </ExcelFile>
    )
}

export {ExportData}