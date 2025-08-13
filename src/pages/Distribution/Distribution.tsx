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
import AssetsQuantityCard from '../../components/Cards/AssetsQuantityCard';

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

// Chart data interface for better type safety
interface ChartDataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Filter types for the chart - now based on asset categories
type AssetCategory = 'Todos' | 'Ação' | 'FII' | 'Fiagro' | 'Tesouro';

const Distribution: React.FC<IDistributionProps> = ( props: IDistributionProps ) => {
  const [loading, setLoading] = useState(false);
  const Market = new MarketUtils();
  const [completePortfolio, setCompletePortfolio] = useState<Data[]>();  
  const [distributionData, setDistributionData] = useState<Distribution>({ total: 0, currentValue: 0, count: 0, profitLoss: 0 });
  const [portfolioSymbolsStringList, setPortfolioSymbolsStringList] = useState<string[]>();
  
  // Chart specific states
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('Todos');

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

  // Generate chart data based on investment data and selected category
  const chartData = useMemo(() => {
    if (!props.investmentData || props.investmentData.length === 0) return [];

    // Filter data based on selected category
    let filteredData = props.investmentData;
    if (selectedCategory !== 'Todos') {
      filteredData = props.investmentData.filter(item => item.Tipo === selectedCategory);
    }

    // If no data after filtering, return empty array
    if (filteredData.length === 0) return [];

    // Calculate total portfolio value for percentage calculations (based on filtered data)
    const totalValue = filteredData.reduce((sum, item) => sum + item.Valor, 0);

    // Modern gradient color palette using gradient IDs for SVG compatibility
    const colors = [
      'url(#gradient1)', // Blue to Purple
      'url(#gradient2)', // Pink to Red
      'url(#gradient3)', // Light Blue to Cyan
      'url(#gradient4)', // Green to Turquoise
      'url(#gradient5)', // Pink to Yellow
      'url(#gradient6)', // Mint to Pink
      'url(#gradient7)', // Coral to Light Pink
      'url(#gradient8)', // Cream to Peach
      'url(#gradient9)', // Purple to Light Pink
      'url(#gradient10)', // Cyan to Blue
      'url(#gradient11)', // Yellow to Teal
      'url(#gradient12)', // Lavender to Blue
    ];

    // Transform investment data into chart format
    const data: ChartDataItem[] = filteredData.map((item, index) => ({
      name: item['Código de Negociação'],
      value: item.Valor,
      percentage: (item.Valor / totalValue) * 100,
      color: colors[index % colors.length]
    }));

    // Sort by value descending for better visual hierarchy
    return data.sort((a, b) => b.value - a.value);
  }, [props.investmentData, selectedCategory]);

  // Custom tooltip for the donut chart - with smaller font size
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 text-xs">{data.name}</p>
          <p className="text-xs text-gray-600">
            Valor: R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-600">
            Percentual: {data.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function for the chart - show all labels regardless of size
  const renderCustomizedLabel = (entry: any) => {
    // Show all labels, but make smaller ones more compact
    if (entry.percentage > 2) {
      return `${entry.name} (${entry.percentage.toFixed(1)}%)`;
    } else {
      // For very small segments, show just the percentage
      return `${entry.percentage.toFixed(1)}%`;
    }
  };

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
            <AssetsQuantityCard userAssets={props.investmentData} />
          </div>

          {/* Distribution Chart Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Chart Header with Filters */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  DISTRIBUIÇÃO POR SETOR E SEGMENTO
                </h2>
                <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
              </div>
              
              {/* Category Selection Combobox */}
              <div className="flex items-center gap-3">
                <label htmlFor="category-select" className="text-sm font-medium text-gray-700">
                  Categoria:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as AssetCategory)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="Todos">Todos os Ativos</option>
                  <option value="Ação">Ações</option>
                  <option value="FII">FII</option>
                  <option value="FIAGRO">Fiagro</option>
                  <option value="Tesouro Direto">Tesouro</option>
                </select>
              </div>
            </div>

            {/* Chart Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donut Chart */}
              <div className="lg:col-span-2">
                <div className="relative h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {/* SVG Gradient Definitions */}
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#4facfe', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#00f2fe', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#43e97b', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#38f9d7', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#fa709a', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#fee140', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#a8edea', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#fed6e3', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#ff9a9e', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#fecfef', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient8" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#ffecd2', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#fcb69f', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient9" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#a18cd1', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#fbc2eb', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient10" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#89f7fe', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#66a6ff', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient11" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#fdbb2d', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#22c1c3', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="gradient12" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#e0c3fc', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#9bb5ff', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomizedLabel}
                        outerRadius={140}
                        innerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                        style={{ fontSize: '10px' }}
                      >
                        {/* Render each segment with its specific color */}
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend/Asset List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-4 sticky top-0 bg-white py-2">
                  Ativos na Carteira
                </h3>
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Gradient color indicator */}
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ 
                        background: item.color.includes('url(') 
                          ? item.color.replace('url(#', 'linear-gradient(135deg, ').replace(')', '')
                            .replace('gradient1', '#667eea 0%, #764ba2 100%')
                            .replace('gradient2', '#f093fb 0%, #f5576c 100%')
                            .replace('gradient3', '#4facfe 0%, #00f2fe 100%')
                            .replace('gradient4', '#43e97b 0%, #38f9d7 100%')
                            .replace('gradient5', '#fa709a 0%, #fee140 100%')
                            .replace('gradient6', '#a8edea 0%, #fed6e3 100%')
                            .replace('gradient7', '#ff9a9e 0%, #fecfef 100%')
                            .replace('gradient8', '#ffecd2 0%, #fcb69f 100%')
                            .replace('gradient9', '#a18cd1 0%, #fbc2eb 100%')
                            .replace('gradient10', '#89f7fe 0%, #66a6ff 100%')
                            .replace('gradient11', '#fdbb2d 0%, #22c1c3 100%')
                            .replace('gradient12', '#e0c3fc 0%, #9bb5ff 100%') + ')'
                          : item.color 
                      }}
                    ></div>
                    
                    {/* Asset info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.percentage.toFixed(2)}%
                      </p>
                    </div>
                    
                    {/* Value */}
                    <div className="text-right">
                      <p className="font-medium text-gray-800 text-sm">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Show message if no data */}
                {chartData.length === 0 && (
                  <div className="text-center py-8">
                    <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum dado de investimento disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Distribution;