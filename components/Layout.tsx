import React from 'react';
import { LucideIcon, LayoutDashboard, PlusCircle, FileText, Settings, Menu, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-colors rounded-lg ${
      isActive
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
    }`}
  >
    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
    {label}
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 no-print`}>
        
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">CompeteAI</span>
          </div>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="space-y-1">
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isActive={activeTab === 'dashboard'} 
              onClick={() => onNavigate('dashboard')} 
            />
            <NavItem 
              icon={PlusCircle} 
              label="New Analysis" 
              isActive={activeTab === 'new'} 
              onClick={() => onNavigate('new')} 
            />
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recent Reports</p>
            </div>
            <NavItem 
              icon={FileText} 
              label="SaaS Pricing Audit" 
              isActive={activeTab === 'report-demo'} 
              onClick={() => onNavigate('report-demo')} 
            />
          </nav>

          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <NavItem 
              icon={Settings} 
              label="Settings" 
              isActive={activeTab === 'settings'} 
              onClick={() => onNavigate('settings')} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print">
          <span className="font-bold text-slate-900 dark:text-white">CompeteAI</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;