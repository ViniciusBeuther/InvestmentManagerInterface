import React from 'react'
import './index.css';
import Sidebar from '../../components/Sidebar/Sidebar'

const Dashboard = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });



    return (
    <section className="h-full flex">
        <article className="w-[20%]">
            <Sidebar />
        </article>
        <article className='bg-tertiary w-[80%] p-5'>
            <h1>Dashboard</h1>
            <h2 className='text-gray-600'>Bem Vindo, Vinicius!</h2>
            <h3 className='text-gray-400 text-sm'>{ formattedDate }</h3>
            <section className='parent h-[70%] box-border'>
                <div className="div1 bg-red-300">
                    <h5>Total investido</h5>
                    <h1>$100.000</h1>
                </div>
                <div className="div2 bg-green-300">
                    <h5>Rentabilidade</h5>
                    <h1>12%</h1>
                </div>
                <div className="div3 bg-blue-300">
                    <h5>Dividendo do Mes Passado</h5>
                    <h1>R$ 1500.00</h1>
                </div>
                <div className="div4 bg-purple-300">
                    <h5>Lucro/Prejuizo aculado</h5>
                    <h1>12% up</h1>
                </div>
                <div className="div5 bg-yellow-300">Pie Chart Distribuicao</div>
                <div className="div6 bg-gray-300">Historico de aporte</div>
                <div className="div7 bg-orange-300">Ativo mais Rentavel</div>
                <div className="div8 bg-pink-300">Ativo menos Rentavel</div>
                <div className="div9 bg-yellow-500">Top 5 por valor</div>
                <div className="div10 bg-green-700">
                    <h5>DY do mês</h5>
                    <h1>0.95%</h1>
                </div>
            </section>
        </article>
    </section>
    )
}

export default Dashboard;