import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { FormClient } from './components/clients/FormClient';
import  FormOrders  from './components/orders/FormOrders';
import Navbar from './components/Navbar/Navbar';


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<FormClient />} />
        <Route path="/Orders" element={<FormOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
