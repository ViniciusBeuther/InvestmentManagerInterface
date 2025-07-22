import { BRAPIResponse, Data } from "../types/data";

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
export const fetchPortfolioPrices = async (portfolio: BRAPIResponse[]) => {
    const results = [];
    const brapiConsultRoute: string = import.meta.env.VITE_BRAPI_API_CONSULT_ROUTE;
    const key: string = import.meta.env.VITE_BRAPI_API_KEY;

    if (!portfolio || portfolio.length === 0) return null;

    for (let i = 0; i < portfolio.length; i++) {
        const cleaned = portfolio[i].symbol.replace(/F$/, '');
        //            console.log('Fetching for:', cleaned);

        try {
            const response = await fetch(`${brapiConsultRoute}/${cleaned}`, {
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            const data = await response.json();
            // console.log('BRAPI Data:', data.results[0]);

            if (data.results && data.results.length > 0) {
                results.push(data.results[0]);
            }
        } catch (error) {
            console.error('Error fetching BRAPI data:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // delay 1 second
    }

    // console.log('Info Array:', results);
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
            .filter((item: string) => !item.match('.*Tesouro.*'))
            .map((item: string) => item.replace('F$', ''));
        // console.log("Portfolio:", filteredPortfolio);
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

    for (let i = 0; i < portfolio.length; i++) {
        const cleaned = portfolio[i].replace(/F$/, '');
        // console.log('Fetching for:', cleaned);

        try {
            const response = await fetch(`${brapiConsultRoute}/${cleaned}`, {
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            const data = await response.json();
            // console.log('BRAPI Data:', data.results[0]);

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
    // console.log('Cached Data:', JSON.parse(cachedData || ''));
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
 * @returns Data[] - an array of Data objects representing the complete portfolio
 */
export const getCompletePortfolio = async () => {
    try {
        const response = await fetch("http://localhost:8000/wallet/assets/all");
        const data = await response.json();
        const filteredPortfolio : Data = data.assets
            .map((item: string) => item.replace('F$', ''));
        // console.log("Portfolio:", filteredPortfolio);
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
    // console.log(`data totals: ${marketData.at(0)?.symbol} - ${portfolio.at(5)?.["Código de Negociação"].replace(/F$/, '')}`);
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

    //console.log(`Total invested in market price for category ${category}: ${total}`);

    return total;
};

