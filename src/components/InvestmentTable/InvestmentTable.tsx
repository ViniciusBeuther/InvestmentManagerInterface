import React, { useState } from 'react';
import { Data } from '../../types/data.ts';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectContent
} from '../ui/select.tsx';

interface InvestmentTablePropsInterface {
  assets: Data[];
}

const InvestmentTable: React.FC<InvestmentTablePropsInterface> = ({ assets }) => {
  const [tableFilter, setTableFilter] = useState<string>('all');

  return (
    <section className='p-5 rounded-[24px]'>
      <article className='flex items-center justify-end'>
        <Select onValueChange={(value) => setTableFilter(value)}>
          <SelectTrigger className='bg-transparent w-[25%] outline-none focus:outline-none rounded-full'>
            <SelectValue placeholder='Categoria' />
          </SelectTrigger>
          <SelectContent className="focus:outline-none outline-none ring-0">
            <SelectGroup>
              <SelectLabel>Ativos</SelectLabel>
              <SelectItem value='all'>Todos</SelectItem>
              <SelectItem value='Ação'>Ações</SelectItem>
              <SelectItem value='fii'>FIIs</SelectItem>
              <SelectItem value='fiagro'>FIAGRO</SelectItem>
              <SelectItem value='tesouro direto'>Tesouro</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </article>

      <article className='rounded-5xl py-2 text-sm mt-4'>
        <table className='w-full rounded-lg shadow-lg border-[1px] border-gray-200'>
          <thead>
            <tr className='text-center bg-secondary-500'>
              <th className='w-[1/5] p-2 rounded-l-md'>Código do Ativo</th>
              <th className='w-[1/5] p-2'>Quantidade</th>
              <th className='w-[1/5] p-2'>Preço Médio</th>
              <th className='w-[1/5] p-2'>Posição</th>
              <th className='w-[1/5] p-2 rounded-r-md'>Categoria</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {assets
              .sort((a, b) => b.Quantidade - a.Quantidade)
              .filter((asset) =>
                tableFilter.toLowerCase() === 'all'
              
              ? true
              : asset.Tipo.toLowerCase() === tableFilter.toLowerCase()
            )
            .map((asset, idx) => (
                <tr key={idx} className='text-gray-800 border-b-[1px]'>
                  <td className='p-1 w-[1/5]'>{asset['Código de Negociação']}</td>
                  <td className='p-1 w-[1/5]'>{asset.Quantidade}</td>
                  <td className='p-1 w-[1/5]'>{asset['Preço Médio'].toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}</td>
                  <td className='p-1 w-[1/5]'>{asset.Valor.toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}</td>
                  <td className='p-1 w-[1/5]'>{asset.Tipo}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};
//https://img.logo.dev/google.com?token=pk_C0qwQwS1QFOVP-DBvizQrg
export default InvestmentTable;
