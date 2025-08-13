import { Target } from 'lucide-react'
import React from 'react'
import { Data } from '../../types/data'
import LoadingWallet from '../Loading/LoadingWallet'

interface IAssetsQuantityCardProps {
    userAssets: Data[]
}

const AssetsQuantityCard: React.FC< IAssetsQuantityCardProps > = ( props ) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            { props.userAssets.length > 0 ? (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Total de Ativos</p>
                        <p className="text-xl font-bold text-gray-900">{ props.userAssets.length }</p>
                    </div>
                </div>
            ) : <LoadingWallet /> }
        </div>
    )
}

export default AssetsQuantityCard;
