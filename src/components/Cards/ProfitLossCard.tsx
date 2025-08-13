import { RefreshCcw, TrendingDown, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { calculateTotalInvestedMarketPrice, formatAmount } from '../../utils/utils'
import { Data } from '../../types/data';
import LoadingWallet from '../Loading/LoadingWallet';

interface ITotalEndPointResponse {
    totalInvestido: number;
    totalDividendos: number;
}

interface IProfitLossCardProps {
    userAssets: Data[]
}

const ProfitLossCard: React.FC<IProfitLossCardProps> = (props) => {
    const totalAPIendpoint: string = 'http://localhost:8000/wallet/totals';
    const [totalData, setTotalData] = useState<ITotalEndPointResponse>();
    const totalInvested = props.userAssets ? calculateTotalInvestedMarketPrice(props.userAssets, 'all') : 0;
    const [difference, setDifference] = useState<number>(0);
    let content: JSX.Element;

    useEffect(() => {
        fetch(totalAPIendpoint)
            .then((res) => res.json())
            .then(setTotalData)
            .catch((err) => console.error('Erro ao buscar dados totais:', err));
    }, []);

    useEffect(() => {
        if (totalData?.totalInvestido != undefined && totalData?.totalInvestido != null) {
            setDifference(totalInvested - totalData.totalInvestido);
        }
    }, [totalData, totalInvested]);

    if (totalData) {
        content = (
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${difference >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {difference ? (
                        <TrendingUp className={`w-5 h-5 ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                        <TrendingDown className={`w-5 h-5 ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Lucro/Prejuízo</p>
                    <p className={`text-xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount( difference )}
                    </p>
                </div>
            </div>
        );
    } else 
        content = <LoadingWallet />;
    

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            { content }
        </div>
    )
}

export default ProfitLossCard
