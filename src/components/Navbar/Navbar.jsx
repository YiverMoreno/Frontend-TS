import "./Navbar.css"
import { Link } from "react-router-dom";


const Navbar = () =>{
    return(
        <section className="header">
            <h1 className="logo"> TS </h1>
            <nav className='navbar'>
                <ul className='nav-links'>
                    <li>
                        <Link to = "/"> Clientes</Link>                                          
                    </li>
                    <li>
                        <Link to = "/orders"> Ordernes </Link>
                    </li>
                </ul>
                <ul className='nav-links'>                    
                </ul>
            </nav>
        </section>
    )
}

export default Navbar