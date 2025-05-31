import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

interface distributionResponse {
    type: string,
    total: number,
    percentage: number
}

const Distribution = () => {
    const [data, setData] = useState<distributionResponse[]>([])
    const endpoint = "http://localhost:8000/wallet/distribution"

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await window.fetch(endpoint)
                const json = await res.json();
                setData(json.distribution);
                // console.log(json)
            } catch (error) {
                alert("Erro ao buscar distribuição...")
                console.error(error)
            }
        }

        fetchData()
    }, [])

    const capitalize = (word: string): string => {
        if (!word) return ""
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    if (data.length === 0) {
        return <p>Loading...</p>
    }

    return (
        <section className="h-full flex">
            <article className="w-[20%]">
                <Sidebar />
            </article>
            <article className='bg-tertiary w-[80%] p-5'>
                <h1>Distribuição da Carteira</h1>
                <h2 className='text-gray-600'>Acompanhe percentuais de alocação.</h2>
                <section className='rounded-5xl py-2 text-sm mt-4'>
                    <table className='w-full rounded-lg shadow-lg border-[1px] border-gray-200'>
                        <thead>
                            <tr className='text-center bg-secondary-500'>
                                <th className='p-2 rounded-l-md'>Categoria</th>
                                <th className='p-2'>Total Investido (R$)</th>
                                <th className='p-2 rounded-r-md'>Distribuição</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <tr className='text-gray-800 border-b-[1px] text-center' key={idx}>
                                    <td className='p-1'>{capitalize(item.type)}</td>
                                    <td className='p-1'>{item.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                                    <td className='p-1'>{item.percentage.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </article>
        </section>
    )
}

export default Distribution
