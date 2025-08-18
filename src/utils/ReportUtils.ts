import jsPDF from "jspdf";
import { ICompleteAssetReportResponse, ICompleteAssetTransactionListResponse, ICompleteDividendReportResponse } from "../types/data";
import autoTable from "jspdf-autotable";
import { formatAmount, formatDate } from "./utils";

class ReportUtils {
    private readonly WALLET_COMPLETE_ENDPOINT: string;
    private readonly DIVIDENDS_COMPLETE_ENDPOINT: string;
    private readonly ALL_TRANSACTIONS_ENDPOINT: string;
    private readonly TABLE_HEADER_ASSETS: string[];
    private readonly TABLE_HEADER_DIVIDENDS: string[];
    private readonly TABLE_HEADER_TRANSACTIONS: string[];
    protected reportYear: number;
    protected assetItems: ICompleteAssetReportResponse[] = [];
    protected dividendItems: ICompleteDividendReportResponse[] = [];
    protected completeAssetTransactionsItems: ICompleteAssetTransactionListResponse[] = []; 
    protected readonly TYPES: string[] = ["complete", "assetTransactions", "dividend", "assets"] as const;

    public constructor() {
        // load API endpoints from .env
        this.WALLET_COMPLETE_ENDPOINT = import.meta.env.VITE_WALLET_COMPLETE_ENDPOINT;
        this.DIVIDENDS_COMPLETE_ENDPOINT = import.meta.env.VITE_DIVIDENDS_COMPLETE_ENDPOINT;
        this.ALL_TRANSACTIONS_ENDPOINT = import.meta.env.VITE_ALL_TRANSACTIONS_ENDPOINT;

        this.TABLE_HEADER_DIVIDENDS = [
            "Código",
            "Total Recebido",
            "Categoria de Distribuição"
        ];
        this.TABLE_HEADER_ASSETS = [
            "Código",
            "Quantidade em 31/12",
            "Total Investido",
            "Preço Médio",
            "Categoria de Ativo",
        ];
        this.TABLE_HEADER_TRANSACTIONS = [
            "Data do Negócio",
            "Tipo de Movimentação",
            "Instituição",
            "Código de Negociação",
            "Quantidade",
            "Preço Unitário",
            "Total"
        ];

        this.assetItems = [];
        this.dividendItems = [];
        this.reportYear = new Date().getFullYear();
    }

    /**
     * function used to fetch the complete wallet report for a given year, 
     * it is used to create a pdf report
     * 
     * @param year - Year to fetch the complete wallet report
     * @returns a list of ICompleteAssetReportResponse or null if no data is found
     */
    public async getWalletCompleteForYear(year: number): Promise<ICompleteAssetReportResponse[]> {
        const response = await fetch(`${this.WALLET_COMPLETE_ENDPOINT}${year}`);
        const data = await response.json();
        this.assetItems = data; // Store the fetched data in the class property
        this.reportYear = year;

        // console.log("Complete Wallet Data for Year:", year, data);
        return data;
    }


    /**
     * function used to fetch the complete dividends report for a given year, 
     * it is used to create a pdf report
     * 
     * @param year - Year to fetch the complete wallet report
     * @returns a list of ICompleteDividendsReportResponse or null if no data is found
     */
    public async getCompleteDividendsForYear(year: number): Promise<ICompleteDividendReportResponse[]> {
        const response = await fetch(`${this.DIVIDENDS_COMPLETE_ENDPOINT}${year}`);
        const data = await response.json();
        this.dividendItems = data; // Store the fetched data in the class property
        this.reportYear = year;

        //console.log("Complete dividend Data for Year:", year, data);
        return data;
    }


    /**
     * used to fetch all the asset transactions (buy / sell) to generate the complete transaction PDF report
     * @returns list of completeAssetTransactions
     */
    public async getCompleteAssetTransactionList() : Promise<ICompleteAssetTransactionListResponse[]>{
        const response = await fetch( `${ this.ALL_TRANSACTIONS_ENDPOINT }` );
        const data = await response.json();
        this.completeAssetTransactionsItems = data;
        return data;
    }

    /**
     * get the date and hour to add to the pdf filename
     * @returns date as string - M.yyyy-hhmm
     */
    public getDateIdentifier(): string {
        const date = new Date();
        return ( date.getMonth() + 1 ).toString() + "." + date.getFullYear().toString() + "-" + date.getHours().toString() + date.getMinutes().toString();
    }


    /**
     * Used to generate the .pdf containing all the assets that the user had in the
     * provided year, it is used to declare the IR
     */
    public generateAssetsReport( pdfDoc : jsPDF ) : void {
        // insert table for assets situation
        autoTable(pdfDoc, {
            head: [this.TABLE_HEADER_ASSETS],
            body: [
                ...this.assetItems.map(item => [
                    item["Código de Negociação"],
                    item.Quantidade,
                    formatAmount(item.Valor),
                    formatAmount(item["Preço Médio"]),
                    item.Tipo
                ])
            ]
        });
    }

    /**
     * Used to generate the .pdf containing the total of dividends/JCP that the user received in the
     * provided year, it is used to declare the IR. (it gets the situation on 12/31/yyyy)
     */
    public generateTotalDividends( pdfDoc: jsPDF ) : void {
        // insert table for dividends
        autoTable(pdfDoc, {
            head: [this.TABLE_HEADER_DIVIDENDS],
            body: [
                ...this.dividendItems.map(item => [
                    item.asset,
                    formatAmount( item.amount ),
                    item.category
                ])
            ]
        })
    }

    /**
     * Used to generate the .pdf containing the asset transaction that the user had in the excel spreadsheet
     */
    public generateCompleteAssetTransactions( pdfDoc: jsPDF ) : void {
        
        // insert table for dividends
        autoTable(pdfDoc, {
            head: [this.TABLE_HEADER_TRANSACTIONS],
            body: [
                ...this.completeAssetTransactionsItems.map(item => [
                    formatDate( item["Data do Negócio"], "DD/MM/YYYY" ),
                    item["Tipo de Movimentação"],
                    item.Instituição,
                    item["Código de Negociação"],
                    item.Quantidade,
                    formatAmount( item.Preço ),
                    formatAmount( item.Valor )
                ])
            ]
        })
    }

    public generatePDFReport( reportType: string ): void {
        let pdfDoc = new jsPDF();
        const docNameMap = new Map<string, string>();
        docNameMap.set("complete", "completo");
        docNameMap.set("assetTransactions", "transacoes");
        docNameMap.set("dividend", "dividendos");
        docNameMap.set("assets", "ativos");

        
        if( ! ( this.TYPES.includes( reportType ) ) )
            throw new Error("invalid type.");

        // TYPES[0] = complete
        if( this.TYPES[0].includes( reportType ) ){
            this.generateAssetsReport( pdfDoc );
            this.generateTotalDividends( pdfDoc );
        } 
        // TYPES[1] = assetTransactions
        else if( this.TYPES[1].includes( reportType ) ){
            this.generateCompleteAssetTransactions( pdfDoc );
        }
        // TYPES[2] = dividends
        else if( this.TYPES[2].includes( reportType ) ) {
            this.generateTotalDividends( pdfDoc );
        }
        // TYPES[3] = asset
        else if( this.TYPES[3].includes( reportType ) ) {
            this.generateAssetsReport( pdfDoc );
        }
        //console.log(`generating report: ${reportType} | list: ${this.TYPES[3]} | bool: ${this.TYPES[3].includes( reportType )}`)
        
        
        // save PDF name to download it
        pdfDoc.save(`report_${ docNameMap.get( reportType ) }_${ this.getDateIdentifier() }.pdf`);
    }
    
};

export default ReportUtils;