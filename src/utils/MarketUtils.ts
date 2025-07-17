import { BRAPIResponse, Data } from "../types/data";
import { getDataFromLocalStorage } from "./utils";
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
};