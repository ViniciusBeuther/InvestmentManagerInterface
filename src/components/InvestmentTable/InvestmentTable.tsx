import React, { useState, useMemo } from 'react';
import { BRAPIResponse, Data } from '../../types/data.ts';
import { formatAmount, getDataFromLocalStorage } from '../../utils/utils.ts';
import { MarketUtils } from '../../utils/MarketUtils.ts';
import { 
  TrendingUp, TrendingDown, BarChart3, Wallet, Target, 
  Building2, Coins, Landmark, Home, Search, Filter, 
  Table, ListOrdered, Eye, Grid3X3, ChevronDown,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

interface InvestmentTablePropsInterface {
  assets: Data[];
}

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



type ViewMode = 'table' | 'cards' | 'category';
type SortField = 'code' | 'type' | 'quantity' | 'avgPrice' | 'currentPrice' | 'value' | 'profit' | 'profitPercent';
type SortOrder = 'asc' | 'desc';

const InvestmentTable: React.FC<InvestmentTablePropsInterface> = ({ assets }) => {
  const marketUtils = new MarketUtils();
  const marketData: BRAPIResponse[] = getDataFromLocalStorage() || [];
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(assets.map(asset => asset.Tipo.toLowerCase()));
    return ['all', ...Array.from(cats).sort()];
  }, [assets]);

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets;

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(asset => asset.Tipo.toLowerCase() === filterCategory);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset['Código de Negociação'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'code':
          comparison = a['Código de Negociação'].localeCompare(b['Código de Negociação']);
          break;
        case 'type':
          comparison = a.Tipo.localeCompare(b.Tipo);
          break;
        case 'quantity':
          comparison = a.Quantidade - b.Quantidade;
          break;
        case 'avgPrice':
          comparison = a['Preço Médio'] - b['Preço Médio'];
          break;
        case 'currentPrice':
          const priceA = marketUtils.getPriceBySymbol(a['Código de Negociação']) || 0;
          const priceB = marketUtils.getPriceBySymbol(b['Código de Negociação']) || 0;
          comparison = priceA - priceB;
          break;
        case 'value':
          comparison = a.Valor - b.Valor;
          break;
        case 'profit':
          const profitA = parseFloat(marketUtils.getProfitBySymbol(a['Código de Negociação'], a.Quantidade, a['Preço Médio'], 'amount').replace(/[^\d.-]/g, '') || '0');
          const profitB = parseFloat(marketUtils.getProfitBySymbol(b['Código de Negociação'], b.Quantidade, b['Preço Médio'], 'amount').replace(/[^\d.-]/g, '') || '0');
          comparison = profitA - profitB;
          break;
        case 'profitPercent':
          const percentA = parseFloat(marketUtils.getProfitBySymbol(a['Código de Negociação'], a.Quantidade, a['Preço Médio'], 'percent').replace(/[^\d.-]/g, '') || '0');
          const percentB = parseFloat(marketUtils.getProfitBySymbol(b['Código de Negociação'], b.Quantidade, b['Preço Médio'], 'percent').replace(/[^\d.-]/g, '') || '0');
          comparison = percentA - percentB;
          break;
        default:
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [assets, filterCategory, searchTerm, sortField, sortOrder, marketUtils]);

  // Group assets by category for category view
  const groupedAssets = useMemo(() => {
    return filteredAndSortedAssets.reduce<Record<string, Asset[]>>((acc, asset) => {
      const key = asset.Tipo.toLowerCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(asset);
      return acc;
    }, {});
  }, [filteredAndSortedAssets]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const renderTableView = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center gap-2">
                  Código
                  {getSortIcon('code')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-2">
                  Tipo
                  {getSortIcon('type')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center gap-2">
                  Quantidade
                  {getSortIcon('quantity')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('avgPrice')}
              >
                <div className="flex items-center gap-2">
                  Preço Médio
                  {getSortIcon('avgPrice')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center gap-2">
                  Preço Atual
                  {getSortIcon('currentPrice')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center gap-2">
                  Valor Total
                  {getSortIcon('value')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('profit')}
              >
                <div className="flex items-center gap-2">
                  Variação (R$)
                  {getSortIcon('profit')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('profitPercent')}
              >
                <div className="flex items-center gap-2">
                  Variação (%)
                  {getSortIcon('profitPercent')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredAndSortedAssets.map((asset) => {
              const currentPrice = marketUtils.getPriceBySymbol(asset['Código de Negociação']);
              const profitAmount = marketUtils.getProfitBySymbol(
                asset["Código de Negociação"],
                asset["Quantidade"],
                asset["Preço Médio"],
                "amount"
              );
              const profitPercent = marketUtils.getProfitBySymbol(
                asset["Código de Negociação"],
                asset["Quantidade"],
                asset["Preço Médio"],
                "percent"
              );
              const isPositive = profitAmount && parseFloat(profitAmount.replace(/[^\d.-]/g, '')) > 0;
              const config = getCategoryConfig(asset.Tipo);

              return (
                <tr key={asset['Código de Negociação']} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={marketUtils.getLogoForAsset(asset, marketData)}
                        alt={`logo-${asset['Código de Negociação']}`}
                        className="w-8 h-8 rounded-lg object-contain border border-gray-200 bg-gray-50"
                      />
                      {asset['Código de Negociação']}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {asset.Quantidade.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatAmount(asset['Preço Médio'])}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {currentPrice !== undefined ? formatAmount(currentPrice) : '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {formatAmount(asset.Valor)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center gap-1">
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {profitAmount || '--'}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {profitPercent || '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategoryView = () => (
    <div className="space-y-6">
      {Object.entries(groupedAssets).map(([category, assets]) => {
        const config = getCategoryConfig(category);
        const totalValue = assets.reduce((sum, asset) => sum + asset.Valor, 0);
        const totalProfit = assets.reduce((sum, asset) => {
          const profit = parseFloat(marketUtils.getProfitBySymbol(asset['Código de Negociação'], asset.Quantidade, asset['Preço Médio'], 'amount').replace(/[^\d.-]/g, '') || '0');
          return sum + profit;
        }, 0);
        const isPositive = totalProfit > 0;

        return (
          <div key={category} className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <config.icon className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">{config.label}</h3>
                    <p className="text-white/80">{assets.length} ativos</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatAmount(totalValue)}</div>
                  <div className={`flex items-center gap-2 justify-end ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="font-semibold">{formatAmount(totalProfit)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-4">
                {assets.map((asset) => {
                  const currentPrice = marketUtils.getPriceBySymbol(asset['Código de Negociação']);
                  const profitAmount = marketUtils.getProfitBySymbol(
                    asset["Código de Negociação"],
                    asset["Quantidade"],
                    asset["Preço Médio"],
                    "amount"
                  );
                  const profitPercent = marketUtils.getProfitBySymbol(
                    asset["Código de Negociação"],
                    asset["Quantidade"],
                    asset["Preço Médio"],
                    "percent"
                  );
                  const isAssetPositive = profitAmount && parseFloat(profitAmount.replace(/[^\d.-]/g, '')) > 0;

                  return (
                    <div key={asset['Código de Negociação']} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={marketUtils.getLogoForAsset(asset, marketData)}
                            alt={`logo-${asset['Código de Negociação']}`}
                            className="w-10 h-10 rounded-lg object-contain border border-gray-200 bg-gray-50"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{asset['Código de Negociação']}</h4>
                            <p className="text-sm text-gray-600">{asset.Quantidade} cotas</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatAmount(asset.Valor)}</div>
                          <div className={`text-sm font-medium ${isAssetPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {profitAmount || '--'} 
                            {profitPercent ? ` (${profitPercent})` : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Carteira de Investimentos
            </h1>
            <p className="text-slate-600 font-medium">Detalhamento completo dos seus ativos</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ativo por código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">Todas as Categorias</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {getCategoryConfig(category).label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Table className="w-4 h-4" />
                Tabela
              </button>
              <button
                onClick={() => setViewMode('category')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'category' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Categorias
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedAssets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-lg text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum ativo encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou o termo de busca.</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' && renderTableView()}
            {viewMode === 'category' && renderCategoryView()}
          </>
        )}
      </div>
    </div>
  );
};

export default InvestmentTable;