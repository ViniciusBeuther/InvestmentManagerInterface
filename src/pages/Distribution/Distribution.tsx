import { BarChart2, BarChart3, Building2, Coins, DollarSign, Grid3X3, Home, Landmark, PieChartIcon, RefreshCcw, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, Treemap
} from 'recharts';
import Sidebar from '../../components/Sidebar/Sidebar';
import { calculateTotalInvestedMarketPrice, fetchPortfolioPricesWithCache, formatAmount, getCompletePortfolio } from '../../utils/utils';
import PortfolioUtils from '../../utils/PortfolioUtils';
import { MarketUtils } from '../../utils/MarketUtils';
import TotalInvestedCard from '../../components/Cards/TotalInvestedCard';
import CurrentTotalInvestedCard from '../../components/Cards/CurrentTotalInvestedCard';
import ProfitLossCard from '../../components/Cards/ProfitLossCard';

// Mock data structure based on your types
interface Data {
  'Código de Negociação': string;
  Tipo: string;
  Quantidade: number;
  'Preço Médio': number;
  Valor: number;
}

interface BRAPIResponse {
  symbol: string;
  regularMarketPrice: number;
  logourl: string;
}

interface Distribution {
  total: number;
  currentValue: number;
  count: number;
  profitLoss: number;
}

interface IDistributionProps {
  investmentData: Data[];
}


const Distribution: React.FC<IDistributionProps> = ( props: IDistributionProps ) => {
  const [loading, setLoading] = useState(false);
  const Market = new MarketUtils();
  const [completePortfolio, setCompletePortfolio] = useState<Data[]>();  
  const [distributionData, setDistributionData] = useState<Distribution>({ total: 0, currentValue: 0, count: 0, profitLoss: 0 });
  const [portfolioSymbolsStringList, setPortfolioSymbolsStringList] = useState<string[]>();


  useEffect( () => {
    const calculateHeaderTotals = async () => {
      try{
        const Portfolio = new PortfolioUtils();
        await Portfolio.start();
        setCompletePortfolio( Portfolio.getData() );
        setPortfolioSymbolsStringList( Portfolio.getStringListOfSymbols() )

        if( portfolioSymbolsStringList == null || portfolioSymbolsStringList == undefined ) return;

        portfolioSymbolsStringList.forEach( (symbol: string) => {
          console.log(`getting item: `, symbol)
          let portfolioItem = Portfolio.getItemInfoBySymbol( symbol );
          console.log(`portfolio item: ${portfolioItem}`);
        })
      } catch (error) {
        console.error("DISTRIBUTION: Error calculating header totals:", error);
      }
    }

    calculateHeaderTotals();
  }, []);

  if (loading) {
    return (
      <section className="h-full flex">
        <article className="w-[20%]">
          <Sidebar />
        </article>
        <article className='bg-gray-50 w-[80%] p-5'>
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3">
              <RefreshCcw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-700">Carregando dados da carteira...</span>
            </div>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="h-full flex">
      <article className="w-[20%]">
        <Sidebar />
      </article>
      <article className='bg-gray-50 w-[80%] p-5 overflow-y-auto'>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <PieChartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Distribuição da Carteira
              </h1>
              <p className="text-slate-600 font-medium">Análise detalhada da alocação dos seus investimentos</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <TotalInvestedCard />
            <CurrentTotalInvestedCard portfolioList={props.investmentData} />
            <ProfitLossCard userAssets={props.investmentData} />
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Ativos</p>
                  <p className="text-xl font-bold text-gray-900">22</p>
                </div>
              </div>
            </div>
          </div>
          </div>
      </article>
    </section>
  );
};

export default Distribution;