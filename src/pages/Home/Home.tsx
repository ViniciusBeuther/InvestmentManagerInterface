import React from 'react'
import { Data } from '../../types/data.ts'
import '../../index.css'
import HomeGrid from '../../components/HomeGrid/HomeGrid.tsx'

interface IHomePropInterface {
  investmentData: Data[]
}

const Home: React.FC<IHomePropInterface> = ({ investmentData }) => {
  return (
    <section className='flex flex-col h-full'>
        <HomeGrid assets={investmentData} />
    </section>
  )
}

export default Home;