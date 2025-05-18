import React from 'react'
import { Data } from '../../types/data.ts'
import '../../index.css'
import HomeGrid from '../../components/HomeGrid/HomeGrid.tsx'

interface homePropInterface {
  investmentData: Data[]
}

const Home: React.FC<homePropInterface> = ({ investmentData }) => {
  return (
    <section className='flex flex-col mx-auto w-[90%]'>
      <header className='bg-pink-400'>header</header>
      <section className='h-full bg-green-400 box-border'>
        <HomeGrid assets={investmentData} />
      </section>
    </section>
  )
}

export default Home;