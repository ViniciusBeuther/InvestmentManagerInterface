import React from 'react';
import { Data } from '../../types/data.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.tsx';

interface InvestmentTablePropsInterface{
  assets: Data[];
}

const InvestmentTable:React.FC<InvestmentTablePropsInterface> = ( { assets }) => {
  return (
    <section>
      <h2 className='text-white'>Here's a table :D</h2>
      <article className='bg-backgroundColor py-2 px-5 rounded-5xl'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código do Ativo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço Médio</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow className='text-white'>
                  <TableCell> {asset['Código de Negociação']} </TableCell>
                  <TableCell> {asset.Quantidade} </TableCell>
                  <TableCell>R$ {asset['Preço Médio'].toFixed(2)}</TableCell>
                  <TableCell>R$ {asset.Valor.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </article>
    </section>
  )
}

export default InvestmentTable
