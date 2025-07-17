import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { getDataFromLocalStorage, getPortfolio } from '../../utils/utils'
import { BRAPIResponse, Data } from '../../types/data'

interface distributionResponse {
    type: string,
    total: number,
    percentage: number
}

const Distribution = () => {
    const financialAPIdata : BRAPIResponse[] = getDataFromLocalStorage() || [];
    const [completePortfolio, setPortfolio] = useState<Data[]>([]);

    // call method to fetch complete portfolio data 
    useEffect(() => {
        async function fetchPortfolioAsync() {
            try {
                const result = await getPortfolio();
                setPortfolio(result);
            } catch (error) {
                console.error("Error fetching portfolio:", error);
            }
        }
        fetchPortfolioAsync();
    }, []);

    // console.log('Portfolio:', completePortfolio);

    // console.log('Financial API Data:', financialAPIdata);

    const capitalize = (word: string): string => {
        if (!word) return ""
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    return (
        <section className="h-full flex">
            <article className="w-[20%]">
                <Sidebar />
            </article>
            <article className='bg-tertiary w-[80%] p-5'>
               distrib
            </article>
        </section>
    )
}

export default Distribution;
