import { Data } from '../../types/data';
import InvestmentTable from '../InvestmentTable/InvestmentTable';
import Sidebar from '../Sidebar/Sidebar';

interface HomeGridProps{
  assets: Data[];
}

const HomeGrid = ( { assets }:HomeGridProps  ) => {
  return (
    <section className="h-full flex">
      <article className="w-[20%]">
        <Sidebar />
      </article>
      <article className='bg-tertiary w-[80%] p-5'>
        <h1>Carteira de Investimentos</h1>
        <h2 className='text-gray-600'>Acompanhe os ativos em seu Portfolio.</h2>
        <InvestmentTable assets={assets} />
      </article>
    </section>
  );
};

export default HomeGrid;
