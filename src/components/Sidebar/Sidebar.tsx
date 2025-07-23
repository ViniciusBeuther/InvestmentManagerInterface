import { useState } from "react";
import { 
  BarChart3, 
  Wallet, 
  PieChart, 
  TrendingUp,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [selected, setSelected] = useState("");
  const url = window.location.href.split("/")[3];

  const navigationItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Visão geral"
    },
    {
      path: "/home",
      label: "Carteira de Ativos",
      icon: Wallet,
      description: "Seus investimentos"
    },
    {
      path: "/distribution",
      label: "Distribuição de Ativos",
      icon: PieChart,
      description: "Análise de alocação"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 w-full h-full text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-gradient-to-tl from-indigo-500/20 to-pink-500/20 rounded-full blur-2xl" />
      </div>
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Brand Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
            Gestão de
            <br />
            Investimentos
          </h3>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Portfolio Manager
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = url === item.path.replace('/', '');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative p-4 rounded-xl transition-all duration-300 hover:bg-white/10 block ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg' 
                    : 'hover:border hover:border-white/20'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full" />
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-slate-400 text-sm font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-400 transform translate-x-1' 
                      : 'text-slate-500 group-hover:text-slate-300 group-hover:transform group-hover:translate-x-1'
                  }`} />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom accent */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Portfolio em crescimento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;