import React, { useEffect, useState } from 'react'
import './index.css';
import Sidebar from '../../components/Sidebar/Sidebar'
import { BRAPIResponse, dividendPerformanceInterface, totalsInterface } from '../../types/data';
import { fetchPortfolioPricesWithCache, formatAmount, formatPercentage, getPortfolio } from '../../utils/utils';

const Dashboard = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth(); // Months are 0
    const totalAPIendpoint: string = "http://localhost:8000/wallet/totals";
    const dividendPerformanceAPIendpoint: string = `http://localhost:8000/wallet/dividends/performance/${year}/${month}`;

    const [totalData, setTotalDate] = useState<totalsInterface | null>();
    const [dividendPerfomanceData, setDividendPerformanceData] = useState<dividendPerformanceInterface | null>();

    // Portfolio to be used for BRAPI API calls
    const [portfolio, setPortfolio] = useState<string[]>([]);
    const [apiData, setApiData] = useState<BRAPIResponse[] | null>(null);
    const key = import.meta.env.VITE_BRAPI_API_KEY;
    const brapiConsultRoute = import.meta.env.VITE_BRAPI_API_CONSULT_ROUTE;

    // Cache duration in milliseconds (15 minutes)
    const CACHE_DURATION = 15 * 60 * 1000;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Fetch total data from the API
    useEffect(() => {
        async function fetchData() {
            try {
                fetch(totalAPIendpoint)
                    .then(response => response.json())
                    .then(data => {
                        setTotalDate(data);
                    })
                    .catch(error => {
                        console.error("Error fetching total data:", error);
                    });
            } catch (error) {
                console.error("Error fetching total data:", error);
            }
        }
        fetchData();
    }, [])

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

    // Fetch dividend performance data from the API
    useEffect(() => {
        async function fetchDividendPerformance() {
            try {
                const response = await fetch(dividendPerformanceAPIendpoint);
                const data = await response.json();
                setDividendPerformanceData(data);
                console.log("Dividend Performance Data:", data);
            } catch (error) {
                console.error("Error fetching dividend performance data:", error);
            }
        }
        fetchDividendPerformance();
    }, []);

const [info, setInfo] = useState<BRAPIResponse[] | null>();

// useEffect(() => {
//     if (portfolio.length === 0) return;

//     const fetchData = async () => {
//         const results = [];

//         for (let i = 0; i < portfolio.length; i++) {
//             const cleaned = portfolio[i].replace(/F$/, '');
//             console.log('Fetching for:', cleaned);

//             try {
//                 const response = await fetch(`${brapiConsultRoute}/${cleaned}`, {
//                     headers: {
//                         Authorization: `Bearer ${key}`,
//                         'Content-Type': 'application/json',
//                     },
//                     method: 'GET',
//                 });

//                 const data = await response.json();
//                 console.log('BRAPI Data:', data.results[0]);

//                 if (data.results && data.results.length > 0) {
//                     results.push(data.results[0]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching BRAPI data:', error);
//             }

//             await new Promise(resolve => setTimeout(resolve, 500)); // delay 1 second
//         }

//         setInfo(results);
//         console.log('Info Array:', results);
//     };

//     fetchData();
// }, [portfolio]);

useEffect(() => {
    if (portfolio.length === 0) return;

    const fetchData = async () => {
        const result = await fetchPortfolioPricesWithCache(portfolio);
        setInfo(result);
    };

    fetchData();
}, [portfolio]);




    return (
        <section className="h-full flex">
            <article className="w-[20%]">
                <Sidebar />
            </article>
            <article className='bg-tertiary w-[80%] p-5'>
                <h1>Dashboard</h1>
                <h2 className='text-gray-600'>Bem Vindo, Vinicius!</h2>
                <h3 className='text-gray-400 text-sm'>{formattedDate}</h3>
                <section className='parent h-[70%] box-border'>
                    <div className="div2 bg-green-300">
                        <h5>Rentabilidade</h5>
                        <h1>12%</h1>
                    </div>
                    {totalData ? (
                        <>
                            <div className="div1 bg-red-300">
                                <h5>Total investido</h5>
                                <h1>{formatAmount(totalData.totalInvestido)}</h1>
                            </div>
                            <div className="div4 bg-purple-300">
                                <h5>Total de Dividendos</h5>
                                <h1>{formatAmount(totalData.totalDividendos)}</h1>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div className="div5 bg-yellow-300">Pie Chart Distribuicao</div>
                    <div className="div6 bg-gray-300">Historico de aporte</div>
                    <div className="div7 bg-orange-300">Ativo mais Rentavel</div>
                    <div className="div8 bg-pink-300">Ativo menos Rentavel</div>
                    <div className="div9 bg-yellow-500">Top 5 por valor</div>
                        {  dividendPerfomanceData ? (
                            <>
                                <div className="div10 bg-green-700">
                                    <h5>DY do mês anterior</h5>
                                    <h1>
                                        { formatPercentage(dividendPerfomanceData.performance) }``
                                    </h1> 
                                </div>
                                <div className="div3 bg-blue-300">
                                    <h5>Proventos do mês anterior</h5>
                                    <h1>{ formatAmount(dividendPerfomanceData.totalReceived) }</h1>
                                </div>
                            </>
                            )
                            : <p>Loading...</p> }
                </section>
            </article>
        </section>
    )
}

export default Dashboard;