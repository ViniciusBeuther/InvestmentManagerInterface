import { BRAPIResponse, Data } from "../types/data";
import { getDataFromLocalStorage } from "./utils";
import treasureLogo from '../../public/treasureLogo.png';
import FIILogo from '../../public/FIILogo.png';

export class MarketUtils {
    public dataCache: BRAPIResponse[] = [];

    public initialize(): void {
        this.dataCache = getDataFromLocalStorage();
    }

    public getDataCache(): BRAPIResponse[] {
        return this.dataCache;
    }

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


    public getAssetBySymbol = (symbol: string): BRAPIResponse | undefined => {
        return this.dataCache.find((asset) => asset.symbol === symbol);
    }

    public getPriceBySymbol = (symbol: string): number => {
        const asset = this.getAssetBySymbol(symbol.replace(/F$/, ''));
        return asset ? asset.regularMarketPrice : 0.00;
    }
};