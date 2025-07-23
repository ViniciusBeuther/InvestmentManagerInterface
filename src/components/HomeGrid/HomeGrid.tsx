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

      <main className="w-[80%] flex flex-col">
        <div className="overflow-y-auto overflow-x-auto max-h-full">
          <InvestmentTable assets={assets} />
        </div>
      </main>
    </section>
  );
};

export default HomeGrid;
