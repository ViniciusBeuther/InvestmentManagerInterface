import React, { useEffect, useState } from 'react';
import './index.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import { BRAPIResponse, Data, dividendPerformanceInterface, totalsInterface } from '../../types/data';
import {
    calculateTotalInvestedMarketPrice,
    fetchPortfolioPricesWithCache,
    formatAmount,
    formatPercentage,
    getPortfolio
} from '../../utils/utils';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Legend, Tooltip, BarChart, Bar, XAxis, CartesianGrid, Line, YAxis } from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    Target,
    Award,
    BarChart3,
    Calendar,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

interface DashboardProps {
    investmentData: Data[];
}

interface DistributionData {
    type: string;
    total: number;
    percentage: number;
}

interface IMonthlyContribution {
    month: string;
    amount: number;
}

interface DistributionResponse {
    distribution: DistributionData[];
}

const Dashboard = ({ investmentData }: DashboardProps) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const totalAPIendpoint = 'http://localhost:8000/wallet/totals';
    const dividendPerformanceAPIendpoint = `http://localhost:8000/wallet/dividends/performance/${year}/${month}`;
    const distributionAPIendpoint = 'http://localhost:8000/wallet/distribution';
    const monthlyContributionAPIEndpoint = 'http://localhost:8000/wallet/contributionHistory';

    const [totalData, setTotalDate] = useState<totalsInterface | null>(null);
    const [dividendPerformanceData, setDividendPerformanceData] = useState<dividendPerformanceInterface | null>(null);
    const [distributionData, setDistributionData] = useState<DistributionResponse | null>(null);
    const [monthlyContributionData, setMonthlyContributionData] = useState<IMonthlyContribution[] | null>(null);
    const [userAssets, setUserAssets] = useState<Data[] | null>(investmentData);
    const [portfolio, setPortfolio] = useState<string[]>([]);
    const [info, setInfo] = useState<BRAPIResponse[] | null>(null);

    const totalInvested = userAssets ? calculateTotalInvestedMarketPrice(userAssets, 'all') : 0;

    const formattedDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        fetch(totalAPIendpoint)
            .then((res) => res.json())
            .then(setTotalDate)
            .catch((err) => console.error('Erro ao buscar dados totais:', err));
    }, []);

    useEffect(() => {
        getPortfolio()
            .then(setPortfolio)
            .catch((err) => console.error('Erro ao buscar portfólio:', err));
    }, []);

    useEffect(() => {
        if (portfolio.length === 0) return;
        fetchPortfolioPricesWithCache(portfolio).then(setInfo);
    }, [portfolio]);

    useEffect(() => {
        fetch(dividendPerformanceAPIendpoint)
            .then((res) => res.json())
            .then(setDividendPerformanceData)
            .catch((err) => console.error('Erro ao buscar performance de dividendos:', err));
    }, []);

    useEffect(() => {
        fetch(distributionAPIendpoint)
            .then((res) => res.json())
            .then(setDistributionData)
            .catch((err) => console.error('Erro ao buscar distribuição:', err));
    }, []);

    useEffect(() => {
        fetch(monthlyContributionAPIEndpoint)
            .then((res) => res.json())
            .then(setMonthlyContributionData)
            .catch((err) => console.error('Erro ao buscar histórico de aportes mensais:', err));
    }, [])
    //console.log(`Monthly Contributions:`, monthlyContributionData);
    // Calculate if position is positive or negative
    const isPositivePosition = totalData ? totalInvested >= totalData.totalInvestido : true;
    const positionPercentage = totalData
        ? ((totalInvested - totalData.totalInvestido) * 100) / totalData.totalInvestido
        : 0;

    // Asset type colors and labels
    const assetTypeConfig = {
        acao: {
            color: '#3B82F6',
            gradient: 'from-blue-500 to-blue-600',
            label: 'Ações',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700'
        },
        fii: {
            color: '#10B981',
            gradient: 'from-emerald-500 to-emerald-600',
            label: 'FIIs',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-700'
        },
        fiagro: {
            color: '#F59E0B',
            gradient: 'from-amber-500 to-amber-600',
            label: 'Fiagro',
            bgColor: 'bg-amber-100',
            textColor: 'text-amber-700'
        },
        tesouro: {
            color: '#8B5CF6',
            gradient: 'from-purple-500 to-purple-600',
            label: 'Tesouro',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-700'
        }
    };

    // Prepare data for pie chart
    const chartData = distributionData?.distribution.map(item => ({
        name: assetTypeConfig[item.type as keyof typeof assetTypeConfig]?.label || item.type,
        value: item.percentage,
        total: item.total,
        color: assetTypeConfig[item.type as keyof typeof assetTypeConfig]?.color || '#6B7280'
    })) || [];

    // Custom tooltip for pie chart
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl rounded-xl p-4">
                    <p className="font-semibold text-slate-800">{data.name}</p>
                    <p className="text-slate-600">
                        <span className="font-medium">{formatAmount(data.total)}</span>
                        <span className="text-slate-500"> ({data.value.toFixed(1)}%)</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="flex h-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
            <aside className="w-[20%]">
                <Sidebar />
            </aside>

            <main className="w-[80%] p-8 overflow-y-auto">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-slate-600 font-medium">Visão geral dos seus investimentos</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium capitalize">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium">Bem-vindo, Vinicius!</span>
                        </div>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Posição Atual */}
                    {totalData && (
                        <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${isPositivePosition
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {isPositivePosition ? (
                                            <ArrowUpRight className="w-4 h-4" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4" />
                                        )}
                                        {formatPercentage(positionPercentage)}
                                    </div>
                                </div>
                                <h3 className="text-slate-600 text-sm font-semibold mb-2">Posição Atual</h3>
                                <p className="text-2xl font-bold text-slate-800 mb-2">{formatAmount(totalInvested)}</p>
                                <p className="text-slate-500 text-xs">
                                    Valor Aplicado: <span className="font-medium text-slate-700">{formatAmount(totalData.totalInvestido)}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Rentabilidade */}
                    <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/20 to-transparent rounded-full blur-xl" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    +12%
                                </div>
                            </div>
                            <h3 className="text-slate-600 text-sm font-semibold mb-2">Rentabilidade Total</h3>
                            <p className="text-2xl font-bold text-slate-800">12%</p>
                            <p className="text-slate-500 text-xs">Performance geral</p>
                        </div>
                    </div>

                    {/* Total de Dividendos */}
                    {totalData && (
                        <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                        Dividendos
                                    </div>
                                </div>
                                <h3 className="text-slate-600 text-sm font-semibold mb-2">Total de Dividendos</h3>
                                <p className="text-2xl font-bold text-slate-800">{formatAmount(totalData.totalDividendos)}</p>
                                <p className="text-slate-500 text-xs">Proventos recebidos</p>
                            </div>
                        </div>
                    )}

                    {/* DY do Mês */}
                    {dividendPerformanceData && (
                        <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                        DY
                                    </div>
                                </div>
                                <h3 className="text-slate-600 text-sm font-semibold mb-2">DY do Mês Anterior</h3>
                                <p className="text-2xl font-bold text-slate-800">{formatPercentage(dividendPerformanceData.performance)}</p>
                                <p className="text-slate-500 text-xs">Dividend Yield</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Proventos do Mês */}
                    {dividendPerformanceData && (
                        <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-2xl" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-tr from-emerald-300/40 to-transparent rounded-full blur-lg" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                            <DollarSign className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-300/30 rounded-full">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">Mensal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-slate-700 text-sm font-bold uppercase tracking-wide">Proventos Recebidos</h3>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                            {formatAmount(dividendPerformanceData.totalReceived)}
                                        </p>
                                        <span className="text-emerald-600 text-sm font-medium">este mês</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <Sparkles className="w-3 h-3" />
                                            <span className="text-xs font-medium">Renda passiva</span>
                                        </div>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <span className="text-slate-500 text-xs">Últimos 30 dias</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder Cards with Modern Design */}
                    {/* Distribuição da Carteira */}
                    {distributionData && (
                        <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-500/20 to-transparent rounded-full blur-xl" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                                        <PieChart className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-700 text-sm font-bold uppercase tracking-wide">Distribuição da Carteira</h3>
                                        <p className="text-slate-500 text-xs">Alocação por tipo de ativo</p>
                                    </div>
                                </div>

                                <div className="h-48 mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Modern Simple Legend */}
                                <div className="grid grid-cols-2 gap-4">
                                    {distributionData.distribution.map((item) => {
                                        const config = assetTypeConfig[item.type as keyof typeof assetTypeConfig];
                                        return (
                                            <div key={item.type} className="flex items-center gap-3 group">
                                                {/* Enhanced Color Dot */}
                                                <div
                                                    className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform duration-200"
                                                    style={{
                                                        backgroundColor: config?.color || '#6B7280',
                                                        boxShadow: `0 2px 8px ${config?.color || '#6B7280'}30`
                                                    }}
                                                />

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-slate-800 truncate m-0">
                                                            {config?.label || item.type}
                                                        </p>
                                                        <span className="ml-3 text-sm font-semibold text-slate-600 tabular-num flex-shrink-0">
                                                            {formatPercentage(item.percentage, 2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-lg" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-slate-700 text-sm font-bold">Histórico de Aportes</h3>
                                    <p className="text-slate-500 text-xs">Últimos meses</p>
                                </div>
                            </div>

                            {/* Chart */}
                            {monthlyContributionData && monthlyContributionData.length > 0 ? (
                                <div className="h-48 mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyContributionData} width={600} height={350}>
                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis
                                                dataKey="date"
                                                angle={-90}
                                                textAnchor="end"
                                                interval={0}
                                                height={70}
                                                tick={{ fill: '#64748B', fontSize: 10 }}
                                            />

                                            <YAxis tick={{ fontSize: 10 }} />

                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white/95 backdrop-blur-sm border border-white/50 shadow-xl rounded-xl p-3">
                                                                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                                                                <p className="text-blue-600 font-medium">
                                                                    {formatAmount(payload[0].value as number)}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={{ r: 2, fill: "#3B82F6" }}
                                                activeDot={{ r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-32 flex items-center justify-center mb-4">
                                    <p className="text-slate-500 text-sm">Carregando dados...</p>
                                </div>
                            )}

                            {/* Summary */}
                            {monthlyContributionData && (
                                <div className="text-center pt-2 border-t border-slate-200/50">
                                    <p className="text-xs text-slate-500 mb-1">Total aportado nos ultimos 12 meses:</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {formatAmount(monthlyContributionData.reduce((sum, item) => sum + item.amount, 0))}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-lg" />
                        <div className="relative z-10 flex items-center justify-center h-full min-h-[120px]">
                            <div className="text-center">
                                <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-slate-600 font-medium text-sm">Ativo Mais Rentável</p>
                                <p className="text-slate-500 text-xs">Análise em andamento</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full blur-lg" />
                        <div className="relative z-10 flex items-center justify-center h-full min-h-[120px]">
                            <div className="text-center">
                                <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <p className="text-slate-600 font-medium text-sm">Maior Oportunidade</p>
                                <p className="text-slate-500 text-xs">Análise de risco</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full blur-lg" />
                        <div className="relative z-10 flex items-center justify-center h-full min-h-[120px]">
                            <div className="text-center">
                                <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                                <p className="text-slate-600 font-medium text-sm">Top 5 Ativos</p>
                                <p className="text-slate-500 text-xs">Por valor investido</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
};

export default Dashboard;