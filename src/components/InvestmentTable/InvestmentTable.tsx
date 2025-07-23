import React from 'react';
import { BRAPIResponse, Data } from '../../types/data.ts';
import { formatAmount, getDataFromLocalStorage } from '../../utils/utils.ts';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '../ui/accordion';
import { MarketUtils } from '../../utils/marketUtils.ts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Coins,
  Landmark,
  Home,
  ChevronDown
} from 'lucide-react';

interface InvestmentTablePropsInterface {
  assets: Data[];
}

const assetTypeConfig = {
  acao: { 
    color: '#3B82F6', 
    gradient: 'from-blue-500 to-blue-600',
    gradientHover: 'from-blue-600 to-blue-700',
    label: 'Ações',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Building2
  },
  fii: { 
    color: '#10B981', 
    gradient: 'from-emerald-500 to-emerald-600',
    gradientHover: 'from-emerald-600 to-emerald-700',
    label: 'FIIs',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: Home
  },
  fiagro: { 
    color: '#F59E0B', 
    gradient: 'from-amber-500 to-amber-600',
    gradientHover: 'from-amber-600 to-amber-700',
    label: 'Fiagro',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: Coins
  },
  tesouro: { 
    color: '#8B5CF6', 
    gradient: 'from-purple-500 to-purple-600',
    gradientHover: 'from-purple-600 to-purple-700',
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
    gradientHover: 'from-slate-600 to-slate-700',
    label: category,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    icon: BarChart3
  };
};



const AssetCard: React.FC<{
  asset: Data;
  marketData: BRAPIResponse[];
  marketUtils: MarketUtils;
}> = ({ asset, marketData, marketUtils }) => {
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
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-gray-300 ml-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={marketUtils.getLogoForAsset(asset, marketData)}
            alt={`logo-${asset['Código de Negociação']}`}
            className="w-12 h-12 rounded-lg object-contain border border-gray-200 bg-gray-50 p-1"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-1">
                {asset['Código de Negociação']}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Target className="w-4 h-4" />
                <span>{asset.Quantidade} cotas</span>
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-800">
                  {formatAmount(asset.Valor)}
                </span>
              </div>
            </div>
            
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
              isPositive 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {profitPercent || '--'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Preço Atual</p>
              <p className="text-sm font-semibold text-slate-800">
                {currentPrice !== undefined ? formatAmount(currentPrice) : '--'}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Preço Médio</p>
              <p className="text-sm font-semibold text-slate-800">
                {formatAmount(asset['Preço Médio'])}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Variação (R$)</p>
              <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {profitAmount || '--'}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total</p>
              <p className="text-sm font-semibold text-slate-800">
                {asset.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const InvestmentTable: React.FC<InvestmentTablePropsInterface> = ({ assets }) => {
  const marketUtils = new MarketUtils();
  const marketData: BRAPIResponse[] = getDataFromLocalStorage() || [];

  // Group assets by category
  const grouped = assets.reduce<Record<string, Data[]>>((acc, asset) => {
    const key = asset.Tipo;
    if (!acc[key]) acc[key] = [];
    acc[key].push(asset);
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
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

        <Accordion type="multiple" className="w-full space-y-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, items]) => {
              const totalValue = items.reduce((sum, item) => sum + item.Valor, 0);
              const config = getCategoryConfig(category);
              const IconComponent = config.icon;
              
              return (
                <AccordionItem key={category} value={category} className="border-0">
                  <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
                    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:bg-gradient-to-r group-hover:${config.gradientHover} transition-all duration-300`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">
                              {config.label}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <BarChart3 className="w-4 h-4" />
                                <span className="font-medium">{items.length} ativos</span>
                              </div>
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-slate-800">
                                {totalValue.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                })}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-slate-800">
                                loss/gain (building)
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 group-data-[state=open]:rotate-180 transition-transform" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="space-y-4 px-0 py-6">
                    {items
                      .sort((a, b) => b.Quantidade - a.Quantidade)
                      .map((asset, idx) => (
                        <AssetCard
                          key={idx}
                          asset={asset}
                          marketData={marketData}
                          marketUtils={marketUtils}
                        />
                      ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </div>
    </div>
  );
};

export default InvestmentTable;