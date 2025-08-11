import React, { useState } from 'react'
import { Data } from '../../types/data';
import { calculateTotalInvestedMarketPrice } from '../../utils/utils';

interface ICurrentTotalInvestedCardProps {
    portfolioList: Data[];
}

const CurrentTotalInvestedCard = ( props: ICurrentTotalInvestedCardProps ) => {
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
        <div>
            { total }
        </div>
    )
}

export default CurrentTotalInvestedCard;
