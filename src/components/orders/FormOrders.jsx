import React, {useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';

const FormOrders = () =>{


    return(
       <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button  className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalClients'>
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
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </div>
    )
}

export default FormOrders
