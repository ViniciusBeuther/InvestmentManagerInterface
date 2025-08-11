import { useEffect, useState } from "react";
import { formatAmount } from "../../utils/utils";
import { Wallet } from "lucide-react";

interface ITotalEndPointResponse {
    totalInvestido: number;
    totalDividendos: number;
}

const TotalInvestedCard = () => {
    const totalAPIendpoint: string = 'http://localhost:8000/wallet/totals';
    const [totalData, setTotalData] = useState<ITotalEndPointResponse>();

    useEffect(() => {
        fetch(totalAPIendpoint)
            .then((res) => res.json())
            .then(setTotalData)
            .catch((err) => console.error('Erro ao buscar dados totais:', err));
    }, []);

    if (!totalData)
        return <p>loading total invested...</p>

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Valor Investido</p>
                    <p className="text-xl font-bold text-gray-900">{ formatAmount( totalData.totalInvestido ) }</p>
                </div>
            </div>
        </div>
    )
}

export default TotalInvestedCard;
