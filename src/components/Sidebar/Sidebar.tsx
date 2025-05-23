import { useState } from "react"
import "../../index.css"
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [selected, setSelected] = useState("");
    const url = window.location.href.split("/")[3];
    //console.log(url.split("/")[3])

    return (
        <div className='bg-backgroundColor w-full h-full text-white p-4'>
        <h3>
            Gestão de Investimentos        
        </h3>
        <nav className="flex flex-col gap-2">
            <Link to={"/dashboard"} className={`text-gray-200 hover:underline hover:cursor-pointer transition ${url == 'dashboard' ? "underline font-medium" : ""}`}>Dashboard</Link>
            <Link to={"/home"} className={`text-gray-200 hover:underline hover:cursor-pointer transition ${url == 'home' ? "underline font-medium" : ""}`}>Carteira de Ativos</Link>
            <Link to={"/distribution"} className={`text-gray-200 hover:underline hover:cursor-pointer transition ${url == 'distribution' ? "underline font-medium" : ""}`}>Distribuição de Ativos</Link>
        </nav>
        </div>
    )
}

export default Sidebar
