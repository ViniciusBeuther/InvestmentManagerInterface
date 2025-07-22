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

interface InvestmentTablePropsInterface {
  assets: Data[];
}

const getCategoryColor = (category: string) => {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100'];
  const index = category.charCodeAt(0) % colors.length;
  return colors[index];
};

const AssetCard: React.FC<{
  asset: Data;
  marketData: BRAPIResponse[];
  marketUtils: MarketUtils;
}> = ({ asset, marketData, marketUtils }) => (
  <div
    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <img
      src={marketUtils.getLogoForAsset(asset, marketData)}
      alt={`logo-${asset['Código de Negociação']}`}
      className="w-12 h-12 rounded-md object-contain border border-gray-200"
    />
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-1 text-sm w-full">
      <div><span className="text-gray-500">Código:</span> {asset['Código de Negociação']}</div>
      <div><span className="text-gray-500">Quantidade:</span> {asset.Quantidade}</div>
      <div><span className="text-gray-500">Preço Atual:</span>{' '}
        {marketUtils.getPriceBySymbol(asset['Código de Negociação']) !== undefined
          ? formatAmount(marketUtils.getPriceBySymbol(asset['Código de Negociação']))
          : '--'}
      </div>
      <div><span className="text-gray-500">Preço Médio:</span> {formatAmount(asset['Preço Médio'])}</div>
      <div><span className="text-gray-500">Valor:</span> {asset.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      <div><span className="text-gray-500">Variação (R$):</span>{' '}
        {marketUtils.getProfitBySymbol(
          asset["Código de Negociação"],
          asset["Quantidade"],
          asset["Preço Médio"],
          "amount"
        )}
      </div>
      <div><span className="text-gray-500">Variação (%):</span>{' '}
        {marketUtils.getProfitBySymbol(
          asset["Código de Negociação"],
          asset["Quantidade"],
          asset["Preço Médio"],
          "percent"
        )}
      </div>
    </div>
  </div>
);

const InvestmentTable: React.FC<InvestmentTablePropsInterface> = ({ assets }) => {
  const marketUtils = new MarketUtils();
  const marketData: BRAPIResponse[] = getDataFromLocalStorage() || [];

  const grouped = assets.reduce<Record<string, Data[]>>((acc, asset) => {
    const key = asset.Tipo;
    if (!acc[key]) acc[key] = [];
    acc[key].push(asset);
    return acc;
  }, {});

  return (
    <section className="p-6 rounded-[24px] bg-white shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Carteira de Investimentos</h2>

      <Accordion type="multiple" className="w-full space-y-2">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, items]) => {
            const totalValue = items.reduce((sum, item) => sum + item.Valor, 0);
            return (
              <AccordionItem key={category} value={category} className="border rounded-lg">
                <AccordionTrigger
                  className={`px-4 py-2 text-left font-medium text-gray-800 border-gray-300 hover:bg-gray-300 ${getCategoryColor(category)}`}
                >
                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span>{category}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs sm:text-sm text-gray-700">
                      <span className="bg-gray-500 text-white px-2 py-1 rounded-md">{items.length} ativos</span>
                      <span className="ml-0 sm:ml-2 text-gray-600">
                        Total: {totalValue.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 px-4 py-2">
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
    </section>
  );
};

export default InvestmentTable;
