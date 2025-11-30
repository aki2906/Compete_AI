import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import NewAnalysis from './views/NewAnalysis';
import ReportView from './views/ReportView';
import { generateAnalysis } from './services/geminiService';
import { AnalysisReport, JobStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('new');
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.IDLE);
  const [progressMessage, setProgressMessage] = useState<string>('');
  
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleStartAnalysis = async (primary: string, competitors: string[]) => {
    setJobStatus(JobStatus.CRAWLING);
    setProgressMessage("Initializing crawl agents...");
    
    try {
      const report = await generateAnalysis(
        primary, 
        competitors, 
        (msg) => setProgressMessage(msg)
      );
      
      setCurrentReport(report);
      setJobStatus(JobStatus.COMPLETED);
      setActiveTab('dashboard'); // Switch to dashboard/report view
    } catch (error) {
      console.error(error);
      setJobStatus(JobStatus.FAILED);
      setProgressMessage("Analysis failed. Please try again.");
      setTimeout(() => setJobStatus(JobStatus.IDLE), 3000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return (
          <NewAnalysis 
            onStartAnalysis={handleStartAnalysis} 
            status={jobStatus}
            progressMessage={progressMessage}
          />
        );
      case 'dashboard':
        if (currentReport) {
          return <ReportView report={currentReport} />;
        }
        return (
          <div className="text-center py-20">
            <div className="bg-slate-100 dark:bg-slate-800 inline-block p-6 rounded-full mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Active Report</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Start a new analysis to see competitive insights here.</p>
            <button 
              onClick={() => setActiveTab('new')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
            >
              Start New Analysis &rarr;
            </button>
          </div>
        );
      case 'report-demo':
         return (
             <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                 Demo report functionality would go here.
             </div>
         );
      default:
        return (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Section under construction
          </div>
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onNavigate={setActiveTab}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;