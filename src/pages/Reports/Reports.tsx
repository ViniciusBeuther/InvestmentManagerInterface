import { 
  Calendar, 
  Download, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Loader2,
  Settings,
  Filter,
  CheckCircle
} from 'lucide-react';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Data, ICompleteAssetReportResponse, ICompleteDividendReportResponse } from '../../types/data';
import ReportUtils from '../../utils/ReportUtils';
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'


interface IReportsProps {
  // Add any props you might need later
  investmentData: Data[];
}

type ReportType = 'complete' | 'assetTransactions' | 'dividend' | 'assets';
type ReportPeriod = 'monthly' | 'quarterly' | 'yearly';

const Reports: React.FC<IReportsProps> = (props: IReportsProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('complete');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('yearly');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const reportUtils = new ReportUtils();
  const [fullWalletData, setFullWalletData] = useState<ICompleteAssetReportResponse[]>([]);
  const [fullDividendData, setFullDividendData] = useState<ICompleteDividendReportResponse[]>([]);

  // Generate year options (current year and past 10 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i);
  
  // Month options
  const monthOptions = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  // Report type options
  const reportTypes = [
    {
      id: 'complete' as ReportType,
      title: 'Relatório Completo',
      description: 'Análise completa da carteira com todas as métricas',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'assets' as ReportType,
      title: 'Ativos',
      description: 'Relatório da posição no dia 31 de dezembro.',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'dividend' as ReportType,
      title: 'Dividendos Recebidos',
      description: 'Dividendos recebidos no ano determinado.',
      icon: PieChart,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'assetTransactions' as ReportType,
      title: 'Transações',
      description: 'Histórico detalhado de compras e vendas (completo).',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleGenerateReport = () => {
    // TODO: Implement PDF generation logic
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(async () => {
      setIsGenerating(false);
      // Here you would trigger the actual PDF generation and download
      
      // fetching data from API
      const data = await reportUtils.getWalletCompleteForYear(selectedYear);
      const dividendData = await reportUtils.getCompleteDividendsForYear(selectedYear);

      // set states
      setFullDividendData(dividendData);
      setFullWalletData(data);

      reportUtils.generatePDFReport( selectedReportType );
      
    }, 3000);
  };

  return (
    <section className="h-full flex">
      <article className="w-[20%]">
        <Sidebar />
      </article>
      <article className='bg-gray-50 w-[80%] p-5 overflow-y-auto'>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Relatórios
              </h1>
              <p className="text-slate-600 font-medium">Gere relatórios detalhados da sua carteira de investimentos</p>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">Configurações do Relatório</h2>
            </div>

            {/* Report Type Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Tipo de Relatório
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedReportType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden ${
                        selectedReportType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-3`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{type.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{type.description}</p>
                      {selectedReportType === type.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Period and Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Period Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Período
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>

              {/* Year Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Ano
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Selection - Only show if monthly period is selected */}
              {selectedPeriod === 'monthly' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mês
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Generation Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Gerar Relatório</h2>
                <p className="text-gray-600 text-sm">
                  Clique no botão abaixo para gerar e baixar o relatório em PDF
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>

            {/* Selected Configuration Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuração Selecionada:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium text-gray-800 ml-2">
                    {reportTypes.find(type => type.id === selectedReportType)?.title}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Período:</span>
                  <span className="font-medium text-gray-800 ml-2">
                    {selectedPeriod === 'monthly' ? 'Mensal' : 
                     selectedPeriod === 'quarterly' ? 'Trimestral' : 'Anual'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium text-gray-800 ml-2">
                    {selectedPeriod === 'monthly' 
                      ? `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                      : selectedYear
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Gerar Relatório PDF
                  </>
                )}
              </button>
            </div>

            {/* Progress/Status indicator during generation */}
            {isGenerating && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-800">Gerando seu relatório...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Processando dados da carteira e compilando informações...
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  );
};

export default Reports;