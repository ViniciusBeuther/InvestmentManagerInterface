import jsPDF from "jspdf";
import { ICompleteAssetReportResponse, ICompleteDividendReportResponse } from "../types/data";
import autoTable from "jspdf-autotable";
import { formatAmount } from "./utils";

class ReportUtils {
    private readonly WALLET_COMPLETE_ENDPOINT: string;
    private readonly DIVIDENDS_COMPLETE_ENDPOINT: string;
    private readonly TABLE_HEADER_ASSETS: string[];
    private readonly TABLE_HEADER_DIVIDENDS: string[];
    protected reportYear: number;
    protected assetItems: ICompleteAssetReportResponse[] = [];
    protected dividendItems: ICompleteDividendReportResponse[] = [];

    public constructor() {
        this.WALLET_COMPLETE_ENDPOINT = import.meta.env.VITE_WALLET_COMPLETE_ENDPOINT;
        this.DIVIDENDS_COMPLETE_ENDPOINT = import.meta.env.VITE_DIVIDENDS_COMPLETE_ENDPOINT;
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

    public async generatePDFReport() {
        let pdfDoc = new jsPDF();
        const date = new Date();
        const generatedTime = ( date.getMonth() + 1 ).toString() + "." + date.getFullYear().toString() + "-" + date.getHours().toString() + date.getMinutes().toString();

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

        // save PDF name to download it
        pdfDoc.save(`report_completo_${ generatedTime }.pdf`);
    }

};

export default ReportUtils;