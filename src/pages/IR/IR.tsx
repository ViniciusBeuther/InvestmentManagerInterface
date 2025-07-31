import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

const IR = () => {
  return (
    <div className='flex h-full'>
      <section className='w-[20%] h-full'>
        <Sidebar />
      </section>
      <section className='w-[80%] p-5 overflow-y-auto bg-slate-50'>
        ir
      </section>
    </div>
  )
}

export default IR
