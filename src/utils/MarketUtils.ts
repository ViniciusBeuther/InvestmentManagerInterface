import { BRAPIResponse, Data, RealTimeData } from "../types/data";
import { formatAmount, formatPercentage, getCompletePortfolio, getDataFromLocalStorage } from "./utils";
import treasureLogo from '../../public/treasureLogo.png';
import FIILogo from '../../public/FIILogo.png';

export class MarketUtils {
/**
 * 
 * @param asset 
 * @returns url of the logo for the asset, if not found returns a fallback logo
 */
    public getLogoForAsset = (asset: Data, marketData: BRAPIResponse[]) => {
        const symbol = asset['Código de Negociação'].replace(/F$/, '');

        if (symbol.includes('Tesouro')) return treasureLogo;
        if (asset.Tipo.toLowerCase().includes('fii')) return FIILogo;

        const logoUrl = marketData.find((value) => value.symbol === symbol)?.logourl;
        return logoUrl || '/fallback-logo.png'; // fallback if no logo found
    };


    /**
     * 
     * @param symbol stock code without the 'F' suffix
     * @returns information about the asset from the local storage
     */
    public getAssetBySymbol = (symbol: string): BRAPIResponse | undefined => {
        const cachedData = getDataFromLocalStorage();
        return cachedData.find((asset) => asset.symbol === symbol);
    }

    /**
     * 
     * @param symbol stock code without the 'F' suffix
     * @returns the current price of the asset, if not found returns 0.00
     */
    public getPriceBySymbol = (symbol: string): number => {
        const asset = this.getAssetBySymbol(symbol.replace(/F$/, ''));
        return asset ? asset.regularMarketPrice : 0.00;
    }


    public getProfitBySymbol = (symbol: string, quantity: number, avgPrice : number, returnResponse: string): string => {
        const cachedData = getDataFromLocalStorage();
        const asset = cachedData.find((asset) => asset.symbol === symbol.replace(/F$/, ''));
        if (!asset) {
            console.error(`Asset with symbol ${symbol} not found in local storage.`);
            return "";
        }
        
        const profit = asset?.regularMarketPrice * quantity - avgPrice * quantity || undefined;
        
        console.log(`Profit for ${symbol}:`, profit);
        if (profit === undefined)
            return "";
        const profitPercent = profit / (avgPrice * quantity) * 100 || 0;

        if (returnResponse == 'percent') 
            return `${formatPercentage(profitPercent, 2)}`
        else if (returnResponse == 'amount') 
            return `${formatAmount(profit)}`;
         else 
            return `${formatPercentage(profitPercent, 2)} (${formatAmount(profit)})`
        
    }

    
public async getFullProfitOrLossByCategory(): Promise<number> {
    const data: Data  = await getCompletePortfolio();
    if (!data) return 0.00;

    let totalProfitOrLoss = 0;

    data.forEach((asset) => {
        const invested = asset.totalInvested ?? 0;
        const current = asset.currentValue ?? 0;
        totalProfitOrLoss += current - invested;
    });

    return totalProfitOrLoss;
}

public async getPortfolioStatisticsRealTime( localPortfolio: Data[] ): Promise< RealTimeData[] >  {
    
    
    return [];
}

};