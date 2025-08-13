import React, { useState } from 'react'
import { Data } from '../../types/data';
import { calculateTotalInvestedMarketPrice, formatAmount } from '../../utils/utils';
import { DollarSign } from 'lucide-react';
import LoadingWallet from '../Loading/LoadingWallet';

interface ICurrentTotalInvestedCardProps {
  portfolioList: Data[];
}

const CurrentTotalInvestedCard = (props: ICurrentTotalInvestedCardProps) => {
  const [total, setTotal] = useState<number>(0);
  const totalInvested = props.portfolioList ? calculateTotalInvestedMarketPrice(props.portfolioList, 'all') : 0;

  React.useEffect(() => {
    console.log(`CurrentTotalInvestedCard: totalInvested: ${totalInvested}`);
    setTotal(totalInvested);
    console.log(`after state set CurrentTotalInvestedCard: totalInvested: ${totalInvested}`);
  }, [totalInvested]);

  if (!totalInvested)
    return <p>loading...</p>

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      { totalInvested ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Valor Atual</p>
            <p className="text-xl font-bold text-gray-900">{formatAmount(total)}</p>
          </div>
        </div>
      ) : <LoadingWallet /> }
    </div>
  )
}

export default CurrentTotalInvestedCard;
