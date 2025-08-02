import { BRAPIResponse, Data, IMarginResponse } from "../types/data";

/**
 * 
 * @param amount 
 * @param currency 
 * @param maxDecimalDigits 
 * @returns a formatted string representing the amount in the specified currency
 */
export const formatAmount = (amount: number, currency: string = 'BRL', maxDecimalDigits: number = 2) => {
    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: maxDecimalDigits
    });
};


/**
 * 
 * @param percentage 
 * @param maxDecimalDigits 
 * @returns the percentage formatted as a string
 */
export const formatPercentage = (percentage: number, maxDecimalDigits: number = 3) => {
    return percentage.toFixed(maxDecimalDigits) + '%';
}


/**
 * 
 * @param portfolio portfolio list fetched from the excel spreadsheet
 * @returns a list of BrapiObjects containing the real data amounts for each asset in the portfolio based on B3
 */
export const fetchPortfolioPrices = async (portfolio: Data[]) => {
    const results = [];
    const brapiConsultRoute: string = import.meta.env.VITE_BRAPI_API_CONSULT_ROUTE;
    const key: string = import.meta.env.VITE_BRAPI_API_KEY;

    if (!portfolio || portfolio.length === 0) return null;

    for ( let portfolioObj of portfolio ) {
        const cleaned = portfolioObj["Código de Negociação"].replace(/F$/, '');

        try {
            const response = await fetch(`${brapiConsultRoute}/${cleaned}`, {
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                results.push(data.results[0]);
            }
        } catch (error) {
            console.error('Error fetching BRAPI data:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // delay 1 second
    }

    return results;
}

/**
 * 
 * @returns the portfolio fetched from the backend (removes 'Tesouro' assets and 'F$' suffix)
 */
export const getPortfolio = async () => {
    try {
        const response = await fetch("http://localhost:8000/wallet/assets/all");
        const data = await response.json();
        const filteredPortfolio = data.assets
            //.filter((item: string) => !item.match('.*Tesouro.*'))
            .filter((item: string) => ! /item/.exec('.*Tesouro.*'))
            .map((item: string) => item.replace('F$', ''));
        return filteredPortfolio;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

/**
 * Fetches portfolio prices with caching mechanism
 * @param portfolio - Array of portfolio asset symbols
 * @returns Array of BRAPIResponse objects or null if no data
 */
export const fetchPortfolioPricesWithCache = async (portfolio: string[]): Promise<BRAPIResponse[] | null> => {
    const CACHE_KEY = import.meta.env.VITE_CACHE_KEY;
    const CACHE_TIMESTAMP_KEY = import.meta.env.VITE_CACHE_TIMESTAMP_KEY;
    const CACHE_DURATION = import.meta.env.VITE_CACHE_DURATION;

    const now = Date.now();
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    // Return cached data if it's valid
    if (cached && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION) {
        try {
            return JSON.parse(cached);
        } catch (error) {
            console.error("Failed to parse cached BRAPI data:", error);
        }
    }

    // Fetch new data if not cached or cache expired
    const results: BRAPIResponse[] = [];
    const brapiConsultRoute: string = import.meta.env.VITE_BRAPI_API_CONSULT_ROUTE;
    const key: string = import.meta.env.VITE_BRAPI_API_KEY;

    for ( let portfolioObj of portfolio ) {
        const cleaned = portfolioObj.replace(/F$/, '');

        try {
            const response = await fetch(`${brapiConsultRoute}/${cleaned}`, {
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                results.push(data.results[0]);
            }
        } catch (error) {
            console.error('Error fetching BRAPI data:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // delay 500ms
    }

    // Save to localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify(results));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());

    return results;
};


/**
 * loads cached data from localStorage with the information about the market prices of the assets in the portfolio
 * @returns BRAPIResponse[] - an array of BRAPIResponse objects representing the cached data
 */
export const getDataFromLocalStorage = (): BRAPIResponse[] => {
    const cachedData = localStorage.getItem(import.meta.env.VITE_CACHE_KEY);
    
    if (cachedData) {
        try {
            return JSON.parse(cachedData);
        } catch (error) {
            console.error("Failed to parse cached data:", error);
        }
    }
    return [];
}

/**
 * the complete portfolio fetched from the backend, it includes tesouro assets and does not remove the 'F$' suffix
 * @returns Data[] - an array of Data objects representing the complete portfolio (only stock codes)
 */
export const getCompletePortfolio = async () => {
    try {
        const response = await fetch("http://localhost:8000/wallet/assets/all");
        const data = await response.json();
        const filteredPortfolio : Data = data.assets
            .map((item: string) => item.replace('F$', ''));
        
        return filteredPortfolio;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

/**
 * 
 * @param category can be 'Ações', 'FIIs', 'Tesouro Direto', "all"
 * @returns the total invested amount in the market price for the given category
 */
export const calculateTotalInvestedMarketPrice = ( portfolio: Data[], category: string ) : number => {
    const marketData = getDataFromLocalStorage();
    
    let total = 0.00;
    if (!marketData || !portfolio) return 0;
    
    for (const asset of portfolio) {
        const symbol = asset['Código de Negociação'].replace(/F$/, '');
        const marketAsset = marketData.find((value) => value.symbol === symbol);
        if (asset.Tipo.includes("Tesouro"))
            total += asset.Valor;

        if (!marketAsset) continue; // Skip if no market data found for the asset

        if (category === 'all') {
            total += marketAsset.regularMarketPrice * asset.Quantidade;
        } 
    }

    

    return total;
};


export const getBestMargin = (category: string, portfolio: Data[]): IMarginResponse  => {
    if (!portfolio || portfolio.length === 0) {
        console.log("No portfolio data available to calculate margin.");
        return { symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 };
    }

    const marketData = getDataFromLocalStorage();
    let profits: { symbol: string; margin: number; category: string, quantity: number, avgPrice: number }[] = [];

    if (!marketData || marketData.length === 0) {
        console.log("No market data available to calculate margin.");
        return { symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 };
    }

    // Iterate through the portfolio to calculate profits    
    portfolio.forEach((asset) => {
        // Use bracket notation for property names with special characters
        const symbol = asset["Código de Negociação"] ? asset["Código de Negociação"].replace(/F$/, '') : '';
        
        marketData.forEach((marketAsset) => {
            if (symbol === marketAsset.symbol) {
                const quantity = asset["Quantidade"];
                const avgPrice = asset["Preço Médio"];
                const profit = marketAsset.regularMarketPrice * quantity - avgPrice * quantity;
                const profitPercent = (profit / (avgPrice * quantity)) * 100;

                profits.push({
                    symbol: marketAsset.symbol,
                    margin: profitPercent,
                    category: asset["Tipo"],
                    quantity: asset["Quantidade"],
                    avgPrice: avgPrice
                });
            }
        });
    });

    // Find the best margin (highest)
    const best = profits.reduce((prev, current) => (prev.margin > current.margin ? prev : current), { symbol: '', margin: -Infinity, category: '', quantity: 0, avgPrice: 0 });
    const worst = profits.reduce((prev, current) => (prev.margin < current.margin ? prev : current), { symbol: '', margin: Infinity, category: '', quantity: 0, avgPrice: 0 });

    // If no profits found, return default object
    if (best.margin === -Infinity) {
        return { symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 };
    }

    if ( category == 'worst' )
        return worst;
    else if ( category == 'best' )
        return best;
    else{
        console.log("Invalid category specified for getBestMargin. Returning default.");
        return { symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 };
    }


}


export const getTop5Margin = (category: string, portfolio: Data[]): IMarginResponse[] => {
    if (!portfolio || portfolio.length === 0) {
        console.log("No portfolio data available to calculate margin.");
        return [{ symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 }];
    }

    const marketData = getDataFromLocalStorage();
    let profits: IMarginResponse[] = [];

    if (!marketData || marketData.length === 0) {
        console.log("No market data available to calculate top 5 margins.");
        return [{ symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 }];
    }

    // Iterate through the portfolio to calculate profits    
    portfolio.forEach((asset) => {
        const symbol = asset["Código de Negociação"] ? asset["Código de Negociação"].replace(/F$/, '') : '';
        marketData.forEach((marketAsset) => {
            if (symbol === marketAsset.symbol) {
                const quantity = asset["Quantidade"];
                const avgPrice = asset["Preço Médio"];
                const profit = marketAsset.regularMarketPrice * quantity - avgPrice * quantity;
                const profitPercent = (profit / (avgPrice * quantity)) * 100;

                profits.push({
                    symbol: marketAsset.symbol,
                    margin: profitPercent,
                    category: asset["Tipo"],
                    quantity: asset["Quantidade"],
                    avgPrice: avgPrice
                });
            }
        });
    });

    if (profits.length === 0) {
        return [{ symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 }];
    }

    if (category === 'best') {
        // Sort descending and return top 5
        return profits
            .sort((a, b) => b.margin - a.margin)
            .slice(0, 3);
    } else if (category === 'worst') {
        // Sort ascending and return top 5
        return profits
            .sort((a, b) => a.margin - b.margin)
            .slice(0, 3);
    } else {
        console.log("Invalid category specified for getTop5Margin. Returning default.");
        return [{ symbol: '', margin: 0, category: '', quantity: 0, avgPrice: 0 }];
    }
}
