import { Data } from '../../types/data';
import InvestmentTable from '../InvestmentTable/InvestmentTable';
import './homegrid.css'

interface HomeGridProps{
  assets: Data[];
}

const HomeGrid = ( { assets }:HomeGridProps  ) => {
  return (
    <div className="parent bg-white h-full">
      <div className="div1">1</div>
      <div className="div2">2</div>
      <div className="div3">3</div>
      <div className="div4 rounded-lg">
        <InvestmentTable assets={assets} />
      </div>
      <div className="div5">5</div>
      <div className="div6">6</div>
      <div className="div7">7</div>
    </div>
  );
};

export default HomeGrid;
