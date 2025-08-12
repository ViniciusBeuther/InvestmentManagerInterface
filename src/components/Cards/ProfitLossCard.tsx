import { TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import { formatAmount } from '../../utils/utils'

const ProfitLossCard: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${true ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {true ? (
                        <TrendingUp className={`w-5 h-5 ${true ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                        <TrendingDown className={`w-5 h-5 ${true ? 'text-green-600' : 'text-red-600'}`} />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Lucro/Prejuízo</p>
                    <p className={`text-xl font-bold ${true ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount(-200)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProfitLossCard
