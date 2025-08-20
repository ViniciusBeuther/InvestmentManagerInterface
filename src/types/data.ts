export interface Data{
  "Código de Negociação": string,
  "Quantidade": number,
  "Valor": number,
  "Preço Médio": number,
  "Tipo": string
}

export interface RealTimeData{
  "Código de Negociação": string,
  "Quantidade": number,
  "Valor": number,
  "Preço Médio": number,
  "Tipo": string
}

export interface ITotalsInterface {
  'totalInvestido': number,
  'totalDividendos': number,
}

export interface IDividendPerformanceInterface{
  'totalInvested' : number,
  'totalReceived' : number,
  'performance' : number,
}


export interface BRAPIResponse {
      "symbol": string,
      "shortName": string,
      "longName": string,
      "currency": string,
      "regularMarketPrice": number,
      "regularMarketDayHigh": number,
      "regularMarketDayLow": number,
      "regularMarketChange": number,
      "regularMarketChangePercent": number,
      "regularMarketTime": string,
      "marketCap": number,
      "regularMarketVolume": number,
      "logourl": string,
}

export interface IMarginResponse {
  "symbol": string,
  "margin": number,
  "category": string,
  "quantity": number,
  "avgPrice": number,
}

export interface ICompleteAssetReportResponse {
  "Código de Negociação": string,
  "Quantidade": number,
  "Valor": number,
  "Preço Médio": number,
  "Tipo": string
}

export interface ICompleteDividendReportResponse {
  "asset" : string,
  "amount"  : number,
  "category" : string,
}

export interface ICompleteAssetTransactionListResponse {
  "Data do Negócio": string,
  "Tipo de Movimentação": string,
  "Mercado": string,
  "Prazo/Vencimento": string,
  "Instituição": string,
  "Código de Negociação": string,
  "Quantidade": number,
  "Preço": number,
  "Valor": number,
  "Mês": number,
  "Ano": number
}