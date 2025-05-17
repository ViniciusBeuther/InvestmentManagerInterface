import React from 'react'
import { Data } from '../../types/data.ts'
import '../../index.css'
import InvestmentTable from '../../components/InvestmentTable/InvestmentTable.tsx'
import HomeGrid from '../../components/HomeGrid/HomeGrid.tsx'

interface homePropInterface{
  investmentData: Data[] 
}

const Home:React.FC<homePropInterface> = ( { investmentData } ) => {
  return (
    <main>
      <h1 className='text-white mb-5'>Hello, world!</h1>
      <InvestmentTable assets={investmentData} />
      <HomeGrid />
    </main>
  )
}

export default Home
