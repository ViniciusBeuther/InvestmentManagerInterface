import { Data } from '../../types/data';
import InvestmentTable from '../InvestmentTable/InvestmentTable';
import Sidebar from '../Sidebar/Sidebar';

interface HomeGridProps {
  assets: Data[];
}

const HomeGrid = ({ assets }: HomeGridProps) => {
  return (
    <section className="h-screen flex overflow-hidden">
      <aside className="w-[20%] overflow-y-auto border-r">
        <Sidebar />
      </aside>

      <main className="w-[80%] p-5 bg-tertiary flex flex-col">
        <header className="mb-4">
          <h1 className="text-xl font-bold">Carteira de Investimentos</h1>
          <h2 className="text-gray-600">Acompanhe os ativos em seu Portfolio.</h2>
        </header>

        <div className="overflow-y-auto overflow-x-auto max-h-full border rounded-lg">
          <InvestmentTable assets={assets} />
        </div>
      </main>
    </section>
  );
};

export default HomeGrid;
