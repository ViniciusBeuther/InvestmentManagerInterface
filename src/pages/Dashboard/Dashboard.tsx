import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

const Dashboard = () => {
  
    return (
    <section className="h-full flex">
        <article className="w-[20%]">
            <Sidebar />
        </article>
        <article className='bg-tertiary w-[80%] p-5'>
            <h1>Dashboard</h1>
            <h2 className='text-gray-600'>Bem vindo, Vinicius!</h2>
            <p>Dashboard grid</p>
        </article>
    </section>
    )
}

export default Dashboard;