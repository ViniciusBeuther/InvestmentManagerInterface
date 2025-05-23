import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

const Distribution = () => {
  
    return (
    <section className="h-full flex">
        <article className="w-[20%]">
            <Sidebar />
        </article>
        <article className='bg-tertiary w-[80%] p-5'>
            <h1>Distribuição da Carteira</h1>
            <h2 className='text-gray-600'>Acompanhe percentuais de alocação.</h2>
        </article>
    </section>
    )
}

export default Distribution;
