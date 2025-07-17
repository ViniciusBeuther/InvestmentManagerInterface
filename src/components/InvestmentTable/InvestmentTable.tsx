import React, { useState } from 'react';
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

const InvestmentTable: React.FC<InvestmentTablePropsInterface> = ({ assets }) => {
  const MarketClass = new MarketUtils();
  const marketData: BRAPIResponse[] = getDataFromLocalStorage() || [];

  // Group assets by category
  const grouped = assets.reduce<Record<string, Data[]>>((acc, asset) => {
    const key = asset.Tipo;
    if (!acc[key]) acc[key] = [];
    acc[key].push(asset);
    return acc;
  }, {});

  return (
    <section className='p-6 rounded-[24px] bg-white shadow-md overfllow-x-auto'>
      <h2 className='text-xl font-semibold mb-4 text-gray-800'>Carteira de Investimentos</h2>

      <Accordion type="multiple" className="w-full space-y-2">
        {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, items]) => (
          <AccordionItem key={category} value={category} className="border rounded-lg">
            <AccordionTrigger 
              className="px-4 py-2 text-left font-medium text-gray-800 bg-gray-200 border-gray-300 hover:bg-gray-300"
            >
              <span className='w-full'>
                {category} 
                <p className='mt-0'>Quantidade: {items.length}</p>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 px-4 py-2">
              {items
                .sort((a, b) => b.Quantidade - a.Quantidade)
                .map((asset, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white border rounded-lg p-3 shadow-sm"
                  >
                    <img
                      src={MarketClass.getLogoForAsset(asset, marketData)}
                      alt={`logo-${asset['Código de Negociação']}`}
                      className="w-10 h-10 rounded-md object-contain"
                    />
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-1 text-sm">
                      <div>
                        <span className="text-gray-500"></span> {asset['Código de Negociação']}
                      </div>
                      <div>
                        <span className="text-gray-500">Quantidade:</span> {asset.Quantidade}
                      </div>
                      <div>
                        <span className="text-gray-500">Preço Atual:</span>{' '}
                        {MarketClass.getPriceBySymbol(asset['Código de Negociação']) !== undefined
                          ? formatAmount(MarketClass.getPriceBySymbol(asset['Código de Negociação']))
                          : '--'}
                      </div>
                      <div>
                        <span className="text-gray-500">Preço Médio:</span>{' '}
                        {formatAmount(asset['Preço Médio'])}
                      </div>
                      <div>
                        <span className="text-gray-500">Valor:</span>{' '}
                        {asset.Valor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default InvestmentTable;
