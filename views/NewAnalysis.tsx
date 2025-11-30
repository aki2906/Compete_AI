import React, { useState } from 'react';
import { Globe, Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import { JobStatus } from '../types';

interface NewAnalysisProps {
  onStartAnalysis: (primary: string, competitors: string[]) => void;
  status: JobStatus;
  progressMessage: string;
}

const NewAnalysis: React.FC<NewAnalysisProps> = ({ onStartAnalysis, status, progressMessage }) => {
  const [primaryUrl, setPrimaryUrl] = useState('https://stripe.com');
  const [competitors, setCompetitors] = useState<string[]>(['https://adyen.com', 'https://paypal.com']);

  const addCompetitor = () => {
    if (competitors.length < 4) {
      setCompetitors([...competitors, '']);
    }
  };

  const removeCompetitor = (index: number) => {
    const newComp = [...competitors];
    newComp.splice(index, 1);
    setCompetitors(newComp);
  };

  const updateCompetitor = (index: number, val: string) => {
    const newComp = [...competitors];
    newComp[index] = val;
    setCompetitors(newComp);
  };

  const isLoading = status === JobStatus.CRAWLING || status === JobStatus.ANALYZING;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryUrl) return;
    onStartAnalysis(primaryUrl, competitors.filter(c => c.trim() !== ''));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <Globe className="absolute inset-0 m-auto text-blue-600 w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Competitive Landscape</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">{progressMessage}</p>
        
        <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full animate-progress" style={{ width: '60%' }}></div>
        </div>
        
        <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">Powered by Gemini 2.5 Flash & Google Search</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">New Competitive Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Enter the websites you want to compare. Our AI agent will crawl, extract features, and generate a comprehensive matrix.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Primary URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Primary Company URL (Your Site)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="url"
                required
                value={primaryUrl}
                onChange={(e) => setPrimaryUrl(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              Competitor URLs (Max 4)
            </label>
            
            <div className="space-y-4">
              {competitors.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateCompetitor(idx, e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`https://competitor-${idx + 1}.com`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCompetitor(idx)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    disabled={competitors.length === 1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {competitors.length < 4 && (
              <button
                type="button"
                onClick={addCompetitor}
                className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" /> Add another competitor
              </button>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
             <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">Analysis Configuration</h4>
             <div className="flex flex-wrap gap-4 text-sm text-blue-700 dark:text-blue-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Deep Feature Extraction</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Pricing Analysis</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                   <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                   <span>SWOT & Strategic Strategy</span>
                </label>
             </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">Estimated time: 30-60 seconds</span>
          <button
            type="submit"
            disabled={!primaryUrl}
            onClick={handleSubmit}
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200 dark:shadow-none"
          >
            Start Analysis <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAnalysis;