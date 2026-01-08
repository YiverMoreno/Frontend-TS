import React, {useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const FormClient = () => {

    const url='http://localhost:3005/api/client/';
    const [client, setClients]= useState([]);
    const [id,setId]= useState('');
    const[firstName, setFirstName]= useState('');
    const[lastName, setLastName]= useState('');
    const [phone, setPhone]= useState('');
    const[dateOfBirth, setDateOfBirth]= useState(1);
    const [dateOfUpdate, setDateOfUpdate]= useState('');
    
    useEffect( ()=>{
        getClient();
    },[]);

    const getClient = async () => {
        const respuesta = await axios.get(url);
        setClients(respuesta.data);
    }

    return (
    <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalClients'>
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
                                    <th>firstName</th>
                                    <th>lastName</th>
                                    <th>phone</th>
                                    <th>dateOfBirth</th>
                                    <th>dateOfUpdate</th>
                                    <th></th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {
                                    client.map( (client,id)=>(
                                     <tr key={client.id}>
                                        <td> {(client.id)} </td>
                                        <td> {(client.firstName)} </td>
                                        <td> {(client.lastName)} </td>
                                        <td> {(client.phone)} </td>
                                        <td> {(client.dateOfBirth)} </td>
                                        <td> {(client.dateOfUpdate)} </td>

                                     </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        <div className='modal fade'>

        </div>
     </div>

    )
}


