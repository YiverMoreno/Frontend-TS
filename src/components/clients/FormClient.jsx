import React, {useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';

export const FormClient = () => {

    const url='http://localhost:3005/api/client/';
    const [client, setClients]= useState([]);
    const [id,setId]= useState('');
    const[firstName, setFirstName]= useState('');
    const[lastName, setLastName]= useState('');
    const [phone, setPhone]= useState('');
    const[dateOfBirth, setDateOfBirth]= useState('');
    const [dateOfUpdate, setDateOfUpdate]= useState('');
    const [title, setTitle]= useState('');
    const [operation, setOperation]= useState(1);
    
    useEffect( ()=>{
        getClient();
    },[]);

    const getClient = async () => {
        const respuesta = await axios.get(url);
        setClients(respuesta.data);
    }

    const openModal = (op,id, firstName, LastName, phone, dateOfBirth) =>{
        setFirstName('');
        setLastName('');
        setPhone('');
        setDateOfBirth('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Cliente');
        }
        else if(op === 2 ){
            setTitle('Editar Cliente');
            setId(id);
            setFirstName(firstName);
            setLastName(LastName);
            setPhone(phone);
            const formattedDate = dateOfBirth
            ? new Date(dateOfBirth).toISOString().split('T')[0]
            : '';
            setDateOfBirth(formattedDate);            
        }
        window.setTimeout(function(){
            document.getElementById('firstName').focus();
        },500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if(firstName.trim() === ''){
        show_alerta('Escribe el nombre del cliente', 'warning');
        }
        else if(lastName.trim() === ''){
        show_alerta('Escribe el apellido del cliente', 'warning');
        }
        else if(phone === ''){
        show_alerta('Escribe el telefono del cliente', 'warning');
        }
        else if(dateOfBirth === ''){
        show_alerta('Digita la fecha de nacimiento', 'warning');
        }
        else{
            if(operation === 1){
                const dateOfUpdate = new Date().toISOString().split('T')[0];
                parametros= {firstName:firstName.trim(), lastName:lastName.trim(), phone:phone,dateOfBirth:dateOfBirth,dateOfUpdate:dateOfUpdate};
                metodo ='POST';
                envarSolicitud(metodo, parametros);
            }
            else{
                const dateOfUpdate = new Date().toISOString().split('T')[0];
                parametros={firstName:firstName.trim(), lastName:lastName.trim(), phone:phone,dateOfBirth:dateOfBirth,dateOfUpdate:dateOfUpdate};            
                updateClient(id,parametros);
                
            }
            
        }
    }


    const envarSolicitud = async(metodo, parametros) => {
        
        await axios({ method: metodo, url: url, data:parametros}).then(function(){
            show_alerta ("Cliente guardado",'success');            
            document.getElementById('btnCerrar').click();
            getClient();
            
        })
        .catch(function(error) {
            show_alerta('Error en la solicitud', 'error');
            console.log(error);
        });
    }
    
    const deleteClient = async (id, firstName) => {
        const MySwal = withReactContent(Swal);

        const result = await MySwal.fire({
            title: `¿Seguro de eliminar el cliente ${firstName}?`,
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            show_alerta('El cliente NO fue eliminado', 'info');
            return;
        }

        try {
            await axios.delete(`${url}${id}`);
            show_alerta('Cliente eliminado', 'success');
            getClient();
        } catch (error) {
            show_alerta('Error al eliminar cliente', 'error');
            console.log(error);
        }
    };

    const updateClient = async (id, clientData) => {
        const MySwal = withReactContent(Swal);

        const result = await MySwal.fire({
            title: '¿Seguro de actualizar los datos del cliente?',
            icon: 'question',
            text: 'Los cambios se guardarán de forma permanente',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            show_alerta('Actualización cancelada', 'info');
            return;
        }

        try {
            console.log(url,id ,clientData)
            await axios.patch(`${url}${id}`, clientData);
            show_alerta('Cliente actualizado correctamente', 'success');
            getClient();
        } catch (error) {
            show_alerta('Error al actualizar cliente', 'error');
            console.error(error);
        }
};

    return (
    <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalClients'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-1g-8 offset-0 offset-1g-12'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Celular</th>
                                    <th>Fecha nacimietno</th>
                                    <th>Fecha actualizacion</th>
                                    <th></th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {client.map( (client,id)=>(
                                     <tr key={client.id}>
                                        <td> {(client.id)} </td>
                                        <td> {(client.firstName)} </td>
                                        <td> {(client.lastName)} </td>
                                        <td> {(client.phone)} </td>
                                        <td> {(client.dateOfBirth)} </td>
                                        <td> {(client.dateOfUpdate)} </td>
                                        <td>
                                            <button onClick={()=>openModal(2,client.id,client.firstName,client.lastName,client.phone,client.dateOfBirth)}  className ="btn btn-warning" data-bs-toggle='modal' data-bs-target='#modalClients'>
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            &nbsp;
                                            <button  onClick={()=> deleteClient(client.id, client.firstName)}className='btn btn-danger'>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                     </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        <div id="modalClients" className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                         </div>                                                
                        <div className="modal-body">
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>                                
                                <span className="input-group-text"><i className='fa-solid fa-person'></i></span>
                                <input type='text' id="firstName" className="form-control" placeholder="Nombre" value={firstName}
                                onChange={(e)=> setFirstName(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="modal-body">
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-1'>
                                <span className="input-group-text"><i className='fa-solid fa-person'></i></span>
                                <input type='text' id="lastName" className="form-control" placeholder="Apellido" value={lastName}
                                onChange={(e)=> setLastName(e.target.value)}></input>
                            </div>
                        </div>
                         <div className="modal-body">
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-1'>
                                <span className="input-group-text"><i className='fa-solid fa-phone'></i></span>
                                <input type='number' id="phone" className="form-control" placeholder="Celular" value={phone}
                                onChange={(e)=> setPhone(e.target.value)}></input>
                            </div>
                        </div>
                       
                        <div className="modal-body">
                            <label>Fecha nacimiento</label>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>        
                                <span className="input-group-text"><i className='fa-solid fa-calendar'></i></span>
                                <input type='date' id="dateOfBirth" className="form-control" placeholder="Fecha" value={dateOfBirth}
                                onChange={(e)=> setDateOfBirth(e.target.value)}></input>
                            </div>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() =>validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    
                    <div className='modal-footer'>
                        <button type='button' id="btnCerrar"className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
    </div>
    
    )
}


