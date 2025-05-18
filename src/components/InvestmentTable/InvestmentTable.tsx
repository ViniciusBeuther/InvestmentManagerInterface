import React from 'react';
import { Data } from '../../types/data.ts';

interface InvestmentTablePropsInterface{
  assets: Data[];
}

const InvestmentTable:React.FC<InvestmentTablePropsInterface> = ( { assets }) => {
  return (
    <section>
      <article className='bg-backgroundColor py-2 px-5 rounded-5xl'>
        <table>
          <thead>
            <tr>
              <th>Código do Ativo</th>
              <th>Quantidade</th>
              <th>Preço Médio</th>
              <th>Posição</th>
            </tr>
          </thead>
            <tbody>
              {assets.map((asset, idx) => asset.Tipo == 'Ação' ? (
                <tr key={idx} className='text-white'>
                  <td> {asset['Código de Negociação']} </td>
                  <td> {asset.Quantidade} </td>
                  <td>R$ {asset['Preço Médio'].toFixed(2)}</td>
                  <td>R$ {asset.Valor.toFixed(2)}</td>
                </tr>
              ) : null)}
            </tbody>
        </table>
      </article>
    </section>
  )
}

export default InvestmentTable
