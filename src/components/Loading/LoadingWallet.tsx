import { RefreshCcw } from 'lucide-react'
import React from 'react'

const LoadingWallet: React.FC = () => {
    return (
        <div className="flex items-center gap-3">
            <RefreshCcw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-700">Carregando dados da carteira...</span>
        </div>
    )
}

export default LoadingWallet;