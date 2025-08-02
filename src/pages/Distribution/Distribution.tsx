import { BarChart2, BarChart3, Building2, Coins, DollarSign, Grid3X3, Home, Landmark, PieChartIcon, RefreshCcw, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, Treemap
} from 'recharts';
import Sidebar from '../../components/Sidebar/Sidebar';
import { fetchPortfolioPricesWithCache, formatAmount, getCompletePortfolio } from '../../utils/utils';
import PortfolioUtils from '../../utils/PortfolioUtils';
import { MarketUtils } from '../../utils/MarketUtils';

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



const Distribution: React.FC = () => {
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
          <div className="bg-gray-200 h-full"></div>
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
        <div className="bg-gray-200 h-full"></div>
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
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Investido</p>
                  <p className="text-xl font-bold text-gray-900">{formatAmount( distributionData.total )}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Atual</p>
                  <p className="text-xl font-bold text-gray-900">{formatAmount(9000)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  true ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {true ? (
                    <TrendingUp className={`w-5 h-5 ${true ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${true ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro/Prejuízo</p>
                  <p className={`text-xl font-bold ${true ? 'text-green-600' : 'text-red-600'}`}>
                    {formatAmount(-200)}
                  </p>
                </div>
              </div>
            </div>

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