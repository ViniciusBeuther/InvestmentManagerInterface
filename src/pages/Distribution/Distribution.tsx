import { BarChart2, BarChart3, Building2, Coins, DollarSign, Grid3X3, Home, Landmark, PieChartIcon, RefreshCcw, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, Treemap
} from 'recharts';
import Sidebar from '../../components/Sidebar/Sidebar';

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

interface DistributionResponse {
  type: string;
  total: number;
  percentage: number;
  count: number;
  currentValue?: number;
  profit?: number;
  profitPercentage?: number;
}

// Mock data for demonstration
const mockPortfolio: Data[] = [
  { 'Código de Negociação': 'PETR4', Tipo: 'acao', Quantidade: 100, 'Preço Médio': 32.50, Valor: 3250 },
  { 'Código de Negociação': 'VALE3', Tipo: 'acao', Quantidade: 50, 'Preço Médio': 85.20, Valor: 4260 },
  { 'Código de Negociação': 'ITUB4', Tipo: 'acao', Quantidade: 200, 'Preço Médio': 28.75, Valor: 5750 },
  { 'Código de Negociação': 'HGLG11', Tipo: 'fii', Quantidade: 200, 'Preço Médio': 165.75, Valor: 33150 },
  { 'Código de Negociação': 'MXRF11', Tipo: 'fii', Quantidade: 150, 'Preço Médio': 10.25, Valor: 1537.50 },
  { 'Código de Negociação': 'XPML11', Tipo: 'fii', Quantidade: 100, 'Preço Médio': 95.40, Valor: 9540 },
  { 'Código de Negociação': 'BTLG11', Tipo: 'fiagro', Quantidade: 75, 'Preço Médio': 98.40, Valor: 7380 },
  { 'Código de Negociação': 'AGRO11', Tipo: 'fiagro', Quantidade: 50, 'Preço Médio': 125.20, Valor: 6260 },
  { 'Código de Negociação': 'TESOURO', Tipo: 'tesouro', Quantidade: 1, 'Preço Médio': 5000, Valor: 5000 },
  { 'Código de Negociação': 'SELIC', Tipo: 'tesouro', Quantidade: 1, 'Preço Médio': 8000, Valor: 8000 },
];

const mockMarketData: BRAPIResponse[] = [
  { symbol: 'PETR4', regularMarketPrice: 35.80, logourl: '/api/placeholder/32/32' },
  { symbol: 'VALE3', regularMarketPrice: 88.45, logourl: '/api/placeholder/32/32' },
  { symbol: 'ITUB4', regularMarketPrice: 31.20, logourl: '/api/placeholder/32/32' },
  { symbol: 'HGLG11', regularMarketPrice: 168.90, logourl: '/api/placeholder/32/32' },
  { symbol: 'MXRF11', regularMarketPrice: 10.85, logourl: '/api/placeholder/32/32' },
  { symbol: 'XPML11', regularMarketPrice: 98.75, logourl: '/api/placeholder/32/32' },
  { symbol: 'BTLG11', regularMarketPrice: 102.30, logourl: '/api/placeholder/32/32' },
  { symbol: 'AGRO11', regularMarketPrice: 128.90, logourl: '/api/placeholder/32/32' },
  { symbol: 'TESOURO', regularMarketPrice: 5150, logourl: '/api/placeholder/32/32' },
  { symbol: 'SELIC', regularMarketPrice: 8240, logourl: '/api/placeholder/32/32' },
];

const assetTypeConfig = {
  acao: {
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    label: 'Ações',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Building2
  },
  fii: {
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-600',
    label: 'FIIs',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: Home
  },
  fiagro: {
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-600',
    label: 'Fiagro',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: Coins
  },
  tesouro: {
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-purple-600',
    label: 'Tesouro',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    icon: Landmark
  }
};

const getCategoryConfig = (category: string) => {
  const key = category.toLowerCase();
  return assetTypeConfig[key as keyof typeof assetTypeConfig] || {
    color: '#6B7280',
    gradient: 'from-slate-500 to-slate-600',
    label: category,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    icon: BarChart3
  };
};

const formatAmount = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getCurrentPrice = (symbol: string) => {
  const market = mockMarketData.find(m => m.symbol === symbol);
  return market?.regularMarketPrice;
};

type ViewMode = 'pie' | 'bar' | 'radial' | 'treemap';

const Distribution: React.FC = () => {
  const [completePortfolio, setPortfolio] = useState<Data[]>([]);
  const [financialAPIdata, setFinancialAPIdata] = useState<BRAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('pie');
  const [showByValue, setShowByValue] = useState(true); // true for current value, false for invested value

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setPortfolio(mockPortfolio);
        setFinancialAPIdata(mockMarketData);
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);

  // Calculate distribution data
  const distributionData = useMemo(() => {
    if (completePortfolio.length === 0) return [];

    const grouped = completePortfolio.reduce<Record<string, DistributionResponse>>((acc, asset) => {
      const type = asset.Tipo.toLowerCase();
      const currentPrice = getCurrentPrice(asset['Código de Negociação']) || asset['Preço Médio'];
      const currentValue = currentPrice * asset.Quantidade;
      const investedValue = asset.Valor;
      const profit = currentValue - investedValue;
      const profitPercentage = investedValue > 0 ? (profit / investedValue) * 100 : 0;

      if (!acc[type]) {
        acc[type] = {
          type: getCategoryConfig(type).label,
          total: 0,
          percentage: 0,
          count: 0,
          currentValue: 0,
          profit: 0,
          profitPercentage: 0
        };
      }

      acc[type].count += 1;
      acc[type].total += investedValue;
      acc[type].currentValue! += currentValue;
      acc[type].profit! += profit;

      return acc;
    }, {});

    const totalInvested = Object.values(grouped).reduce((sum, item) => sum + item.total, 0);
    const totalCurrent = Object.values(grouped).reduce((sum, item) => sum + (item.currentValue || 0), 0);

    return Object.entries(grouped).map(([key, data]) => {
      const valueToUse = showByValue ? (data.currentValue || 0) : data.total;
      const totalToUse = showByValue ? totalCurrent : totalInvested;
      
      return {
        ...data,
        percentage: totalToUse > 0 ? (valueToUse / totalToUse) * 100 : 0,
        profitPercentage: data.total > 0 ? ((data.profit || 0) / data.total) * 100 : 0,
        color: getCategoryConfig(key).color,
        fill: getCategoryConfig(key).color
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [completePortfolio, showByValue]);

  // Calculate totals
  const totals = useMemo(() => {
    return distributionData.reduce((acc, item) => ({
      invested: acc.invested + item.total,
      current: acc.current + (item.currentValue || 0),
      profit: acc.profit + (item.profit || 0),
      assets: acc.assets + item.count
    }), { invested: 0, current: 0, profit: 0, assets: 0 });
  }, [distributionData]);

  const overallProfitPercentage = totals.invested > 0 ? (totals.profit / totals.invested) * 100 : 0;
  const isOverallPositive = totals.profit > 0;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900">{data.type}</p>
          <p className="text-sm text-gray-600">
            {showByValue ? 'Valor Atual' : 'Valor Investido'}: {formatAmount(showByValue ? data.currentValue : data.total)}
          </p>
          <p className="text-sm text-gray-600">Participação: {data.percentage.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Ativos: {data.count}</p>
          <p className={`text-sm font-medium ${data.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Lucro: {formatAmount(data.profit)} ({data.profitPercentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={distributionData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey={showByValue ? "currentValue" : "total"}
          label={({ percentage }) => `${percentage.toFixed(1)}%`}
          labelLine={false}
        >
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={showByValue ? "currentValue" : "total"} fill="#8884d8">
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderRadialChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={distributionData}>
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
          background
          dataKey="percentage"
        >
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </RadialBar>
        <Tooltip content={<CustomTooltip />} />
      </RadialBarChart>
    </ResponsiveContainer>
  );

  const renderTreemap = () => (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={distributionData}
        dataKey={showByValue ? "currentValue" : "total"}
        aspectRatio={4/3}
        stroke="#fff"
        fill="#8884d8"
        content={({ depth, x, y, width, height, payload }) => {
          if (depth === 1) {
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  style={{
                    fill: payload.color,
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                  }}
                />
                <text
                  x={x + width / 2}
                  y={y + height / 2 - 7}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {payload.type}
                </text>
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 9}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                >
                  {payload.percentage.toFixed(1)}%
                </text>
              </g>
            );
          }
          // Always return a ReactElement, even if empty
          return <g />;
        }}
      />
    </ResponsiveContainer>
  );

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
                  <p className="text-xl font-bold text-gray-900">{formatAmount(totals.invested)}</p>
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
                  <p className="text-xl font-bold text-gray-900">{formatAmount(totals.current)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isOverallPositive ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isOverallPositive ? (
                    <TrendingUp className={`w-5 h-5 ${isOverallPositive ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${isOverallPositive ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro/Prejuízo</p>
                  <p className={`text-xl font-bold ${isOverallPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formatAmount(totals.profit)}
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
                  <p className="text-xl font-bold text-gray-900">{totals.assets}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showByValue}
                    onChange={(e) => setShowByValue(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mostrar por valor atual (em vez de investido)
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('pie')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'pie' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <PieChartIcon className="w-4 h-4" />
                  Pizza
                </button>
                <button
                  onClick={() => setViewMode('bar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'bar' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  Barras
                </button>
                <button
                  onClick={() => setViewMode('radial')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'radial' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Radial
                </button>
                <button
                  onClick={() => setViewMode('treemap')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'treemap' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Treemap
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribuição por Categoria
                </h3>
                {viewMode === 'pie' && renderPieChart()}
                {viewMode === 'bar' && renderBarChart()}
                {viewMode === 'radial' && renderRadialChart()}
                {viewMode === 'treemap' && renderTreemap()}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhamento por Categoria</h3>
                <div className="space-y-4">
                  {distributionData.map((item, index) => {
                    // Find the original asset type key from assetTypeConfig
                    const assetTypeKey = Object.keys(assetTypeConfig).find(
                      key => assetTypeConfig[key as keyof typeof assetTypeConfig].label === item.type
                    ) || item.type.toLowerCase();
                    const config = getCategoryConfig(assetTypeKey);
                    const IconComponent = config.icon;
                    const isPositive = (item.profit || 0) > 0;

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${config.gradient} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.type}</h4>
                            <p className="text-sm text-gray-600">{item.count} ativos</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Participação:</span>
                            <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor Investido:</span>
                            <span className="font-medium">{formatAmount(item.total)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor Atual:</span>
                            <span className="font-medium">{formatAmount(item.currentValue || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Resultado:</span>
                            <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {formatAmount(item.profit || 0)} ({item.profitPercentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overall Performance */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Geral</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Retorno Total:</span>
                    <span className={`font-semibold ${isOverallPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {overallProfitPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lucro/Prejuízo:</span>
                    <span className={`font-semibold ${isOverallPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatAmount(totals.profit)}
                    </span>
                  </div>
                  <div className={`mt-4 p-3 rounded-lg ${isOverallPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                      {isOverallPositive ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${isOverallPositive ? 'text-green-800' : 'text-red-800'}`}>
                        {isOverallPositive ? 'Carteira em alta' : 'Carteira em baixa'}
                      </span>
                    </div>
                  </div>
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