import React, {useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../functions';

const FormOrders = () =>{

     const url='http://localhost:3005/api/orders/';
        const [order, setOrders]= useState([]);
        const [clientId,setClientId]= useState('');
        const [status, setStatus] = useState('creada');
        const [details, setDetails] = useState([
            { productName: '', quantity: '', unitPrice: '' }
        ]);
        const [orderId, setOrderId] = useState('');
        const [orderStatus, setOrderStatus] = useState('');


    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(url);
            setOrders(data);
        } catch (error) {
            console.error('Error obteniendo órdenes', error);
        }
    };

    const handleDetailChange = (index, field, value) => {
        const copy = [...details];
        copy[index][field] = value;
        setDetails(copy);
    };

    const addDetail = () => {
        setDetails([...details, { productName: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeDetail = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const createOrder = async () => {
        if(clientId.trim() === ''){
            show_alerta('Escribe el id del cliente', 'warning');
        }
        try {
            await axios.get(`http://localhost:3005/api/client/${clientId}`);
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 400) {
                show_alerta('El cliente no existe', 'error');
                return;
            }
            show_alerta('Error validando el cliente', 'error');
            return;
        }
        for (const detail of details) {

        if (detail.productName.trim() === '') {
            show_alerta('El nombre del producto es obligatorio', 'warning');
            return;
        }

        if (!detail.quantity || detail.quantity <= 0) {
            show_alerta('La cantidad debe ser mayor a 0', 'warning');
            return;
        }

        if (detail.unitPrice === null || detail.unitPrice <= 0) {
            show_alerta('El valor unitario debe ser mayor a 0', 'warning');
            return;
        }
    }
                                      
        try {
            const payload = {
                clientId,
                status,
                details
            };

            await axios.post(url, payload);

            fetchOrders();
            setClientId('');
            setStatus('creada');
            setDetails([{ productName: '', quantity: 1, unitPrice: 0 }]);

            show_alerta('Orden guardada con éxito  ', 'success');
            document.getElementById('btnCerrar').click();
        } catch (error) {
            console.error('Error creando la orden', error);
        }
    };

    const openStatusModal = (order) => {
        setOrderId(order.id);
        setOrderStatus(order.status);
    };
    const updateOrderStatus = async () => {
        if (orderStatus.trim() === '') {
            show_alerta('Selecciona un estado', 'warning');
            return;
        }
         if (!orderId) {
            show_alerta('Orden no válida', 'error');
            return;
        }

        if (!orderStatus) {
            show_alerta('Selecciona un estado', 'warning');
            return;
        }

        try {
            await axios.patch(`${url}${orderId}`, {
                status: orderStatus
            });

            fetchOrders();
            document.getElementById('btnCerrarStatus').click();
            show_alerta('Estado actualizado correctamente', 'success');

        } catch (error) {
            console.error(error.response?.data || error);
            show_alerta('Error actualizando el estado', 'error');
        }
    };

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
            <div className='row mt-4'>
                <div className='col-12 col-1g-8 offset-0 offset-1g-12'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente id</th>
                                    <th>Estado</th>
                                    <th>total</th>
                                    <th>Fecha de creacion</th>
                                    <th>Fecha actualizacion</th>
                                    <th></th> </tr>                                
                            </thead>
                            <tbody className="table-group-divider">
                                {order.map(order => (
                                    <React.Fragment key={order.id}>
                                                                       
                                    <tr className="table-primary">
                                        <td>{order.id}</td>
                                        <td>{order.client.id}</td>
                                        <td>{order.status}</td>
                                        <td>{order.total}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <button  className ="btn btn-warning"   onClick={() => openStatusModal(order)} data-bs-toggle='modal' data-bs-target='#modalUpdateStatus'>
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            &nbsp;
                                            <button  className='btn btn-danger'>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                               
                                    <tr className="table-secondary">
                                        <th colSpan={2}>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Valor unitario</th>
                                        <th colSpan={2}>Subtotal</th>
                                    </tr>
                                   
                                    {order.details.map(detail => (
                                        <tr key={detail.id}>
                                        <td colSpan={2}>{detail.productName}</td>
                                        <td>{detail.quantity}</td>
                                        <td>{detail.unitPrice}</td>
                                        <td colSpan={2}>
                                            {detail.quantity * detail.unitPrice}
                                        </td>
                                        </tr>
                                    ))}

                                    </React.Fragment>
                                ))}
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id="modalClients" className="modal fade" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Crear Orden</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                    
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-id-card"></i>
                                </span>
                                <input
                                    type="text"
                                    id='client_id'
                                    className="form-control"
                                    placeholder="ID del cliente"
                                    value={clientId}
                                    onChange={e => setClientId(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-flag"></i>
                                </span>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    <option value="creada">Creada</option>
                                    <option value="pagada">Pagada</option>
                                    <option value="rechazada">Rechazada</option>
                                </select>
                            </div>

                            <hr />
                          
                            {details.map((detail, index) => (
                                <div className="row mb-2" key={index}>
                                    <div className="col-md-5">
                                        <input
                                            type="text"
                                            id=''
                                            className="form-control"                                    
                                            placeholder="Producto"
                                            value={detail.productName}
                                            onChange={e =>
                                                handleDetailChange(index, 'productName', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Cant"
                                            value={detail.quantity}
                                            onChange={e =>
                                                handleDetailChange(index, 'quantity', Number(e.target.value))
                                            }
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Valor u"
                                            value={detail.unitPrice}
                                            onChange={e =>
                                                handleDetailChange(index, 'unitPrice', Number(e.target.value))
                                            }
                                        />
                                    </div>

                                    <div className="col-md-2 d-grid">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => removeDetail(index)}
                                            disabled={details.length === 1}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="d-grid">
                                <button className="btn btn-outline-primary" onClick={addDetail}>
                                    <i className="fa-solid fa-plus"></i> Agregar producto
                                </button>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={() =>createOrder()}>
                                <i className="fa-solid fa-floppy-disk"></i> Guardar
                            </button>
                            <button
                                type="button"
                                id="btnCerrar"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >Cerrar</button>
                        </div>

                    </div>
                </div>
            </div>
            <div id="modalUpdateStatus" className="modal fade" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Actualizar estado de la orden</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body">

                        <div className="mb-3">
                            <label className="form-label">Estado</label>
                            <select
                                className="form-select"
                                value={orderStatus}
                                onChange={e => setOrderStatus(e.target.value)}
                            >
                                <option value="">Seleccione</option>
                                <option value="creada">Creada</option>
                                <option value="pagada">Pagada</option>
                                <option value="rechazada">Rechazada</option>
                            </select>
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={updateOrderStatus}
                        >
                            Guardar
                        </button>

                        <button
                            type="button"
                            id="btnCerrarStatus"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
        </div>

        </div>
    )
}

export default FormOrders
