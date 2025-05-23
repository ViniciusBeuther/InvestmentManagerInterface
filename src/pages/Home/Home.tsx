import React from 'react'
import { Data } from '../../types/data.ts'
import '../../index.css'
import HomeGrid from '../../components/HomeGrid/HomeGrid.tsx'

interface homePropInterface {
  investmentData: Data[]
}

const Home: React.FC<homePropInterface> = ({ investmentData }) => {
  return (
    <section className='flex flex-col h-full'>
        <HomeGrid assets={investmentData} />
    </section>
  )
}

export default Home;