export interface Data{
  "Código de Negociação": string,
  "Quantidade": number,
  "Valor": number,
  "Preço Médio": number,
  "Tipo": string
}

export interface totalsInterface {
  'totalInvestido': number,
  'totalDividendos': number,
}

export interface dividendPerformanceInterface{
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