import { Data } from "../types/data";

class PortfolioUtils {
    private data : Data[] = [];
    private readonly symbolsStringList : string[] = [];

    // constructor to initialize the class with async start method
    public start = async () => {
        await this.initialize();
        this.setStringListOfSymbols();
    }

    protected initialize = async () => {
        try{
            const response = await fetch( import.meta.env.VITE_API_URL_WALLET );
            const result = await response.json();
            this.data = result;
            console.log( result );
        } catch ( error ) {
            console.error("Error initializing PortfolioUtils", error);
        }
    };

    
    public getData = () : Data[] => {
        return this.data;
    }

    public getStringListOfSymbols = () : string[] => {
        return this.symbolsStringList;
    }

    public getItemInfoBySymbol = ( symbol: string ) : Data | null => {
        this.data.forEach( ( item: Data ) => {
            if( symbol.includes( item["Código de Negociação"] ) )
                return item;
        } );
        
        return null;
    }

    private readonly setStringListOfSymbols = () => {
        if (this.data.length == 0) return;

        this.data.forEach(( item:Data ) => this.symbolsStringList.push( item["Código de Negociação"] ) );
    }


};

export default PortfolioUtils;