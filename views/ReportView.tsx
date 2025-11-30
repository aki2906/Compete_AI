import React, { useState } from 'react';
import { AnalysisReport } from '../types';
import { CheckCircle, XCircle, AlertCircle, Download, Share2, BarChart2, DollarSign, Zap, Search, ArrowUpRight, Smartphone, Gauge, Globe, Target, Code } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ScatterChart, Scatter, Cell
} from 'recharts';

interface ReportViewProps {
  report: AnalysisReport;
}

const COLORS = ['#2563eb', '#0ea5e9', '#22c55e', '#eab308', '#f97316'];

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'pricing' | 'strategy' | 'visuals' | 'seo'>('matrix');
  const [copySuccess, setCopySuccess] = useState(false);

  const getHostname = (url: string) => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
  };

  const handleShare = async () => {
    try {
      // Create a nice summary string
      const summaryText = `
Competitor Analysis: ${getHostname(report.primaryUrl)} vs ${report.competitors.map(getHostname).join(', ')}
Summary: ${report.summary}
      `.trim();
      
      await navigator.clipboard.writeText(summaryText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const renderFeatureIcon = (available: boolean | string) => {
    if (available === true) return <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />;
    if (available === false) return <XCircle className="w-5 h-5 text-slate-200 dark:text-slate-700 mx-auto" />;
    return <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">{available}</span>;
  };

  // --- Tab Content Renderers ---

  const renderMatrix = () => (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="min-w-full bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-950">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-950 z-10 w-1/3">
              Feature
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 dark:border-blue-500">
              {getHostname(report.primaryUrl)} (You)
            </th>
            {report.competitors.map((url, idx) => (
              <th key={idx} className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {getHostname(url)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {report.features.map((feature, idx) => (
            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-slate-900 z-10">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{feature.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{feature.canonical_feature} • {(feature.confidence * 100).toFixed(0)}% conf</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50/10 dark:bg-blue-900/10">
                {renderFeatureIcon(feature.availability[report.primaryUrl])}
              </td>
              {report.competitors.map((url, cIdx) => (
                <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-center">
                  {renderFeatureIcon(feature.availability[url])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPricing = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print-container">
      {report.pricing.map((model, idx) => {
        const isPrimary = model.url === report.primaryUrl;
        return (
          <div key={idx} className={`rounded-xl border ${isPrimary ? 'border-blue-200 dark:border-blue-800 shadow-md ring-1 ring-blue-100 dark:ring-blue-900' : 'border-slate-200 dark:border-slate-800 shadow-sm'} bg-white dark:bg-slate-900 overflow-hidden print-break-inside-avoid`}>
            <div className={`p-4 border-b ${isPrimary ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'}`}>
              <h3 className={`font-bold text-lg ${isPrimary ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'} truncate`}>
                {getHostname(model.url)}
              </h3>
              {model.has_free_trial && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2">
                  <Zap className="w-3 h-3 mr-1" /> Free Trial Available
                </span>
              )}
            </div>
            <div className="p-6 space-y-6">
              {model.tiers.map((tier, tIdx) => (
                <div key={tIdx} className="pb-4 last:pb-0 border-b last:border-0 border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{tier.tier_name}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tier.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {tier.features_included.slice(0, 4).map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-500 dark:text-slate-400 flex items-start">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                    {tier.features_included.length > 4 && (
                      <li className="text-xs text-slate-400 italic pl-5">
                        + {tier.features_included.length - 4} more...
                      </li>
                    )}
                  </ul>
                </div>
              ))}
              {model.tiers.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Pricing details not public or custom quote only.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderStrategy = () => (
    <div className="space-y-8">
      {/* Tech Stack Analysis */}
      {report.tech_stacks && report.tech_stacks.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print-break-inside-avoid">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2 text-blue-500" /> Tech Stack Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.tech_stacks.map((stack, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-slate-200 mb-2">{getHostname(stack.url)}</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Frontend:</span> <span className="text-slate-700 dark:text-slate-300">{stack.frontend?.join(', ') || 'N/A'}</span></div>
                  <div><span className="text-slate-500">Backend:</span> <span className="text-slate-700 dark:text-slate-300">{stack.backend?.join(', ') || 'N/A'}</span></div>
                  <div><span className="text-slate-500">Analytics:</span> <span className="text-slate-700 dark:text-slate-300">{stack.analytics?.join(', ') || 'N/A'}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SWOT Analysis */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-500" /> SWOT Analysis
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[report.primaryUrl, ...report.competitors].map((url, idx) => {
             const swot = report.swot?.[url];
             if (!swot) return null;
             const isPrimary = url === report.primaryUrl;

             return (
               <div key={idx} className={`bg-white dark:bg-slate-900 p-6 rounded-xl border ${isPrimary ? 'border-blue-200 dark:border-blue-800' : 'border-slate-200 dark:border-slate-800'} shadow-sm print-break-inside-avoid`}>
                 <h4 className={`font-bold mb-4 ${isPrimary ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                   {getHostname(url)}
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/30">
                     <h5 className="text-xs font-bold text-green-800 dark:text-green-400 uppercase mb-2">Strengths</h5>
                     <ul className="list-disc pl-4 space-y-1">
                       {swot.strengths.map((s, i) => <li key={i} className="text-xs text-slate-700 dark:text-slate-300">{s}</li>)}
                     </ul>
                   </div>
                   <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30">
                     <h5 className="text-xs font-bold text-red-800 dark:text-red-400 uppercase mb-2">Weaknesses</h5>
                     <ul className="list-disc pl-4 space-y-1">
                       {swot.weaknesses.map((s, i) => <li key={i} className="text-xs text-slate-700 dark:text-slate-300">{s}</li>)}
                     </ul>
                   </div>
                   <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900/30">
                     <h5 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase mb-2">Opportunities</h5>
                     <ul className="list-disc pl-4 space-y-1">
                       {swot.opportunities.map((s, i) => <li key={i} className="text-xs text-slate-700 dark:text-slate-300">{s}</li>)}
                     </ul>
                   </div>
                   <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-100 dark:border-amber-900/30">
                     <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase mb-2">Threats</h5>
                     <ul className="list-disc pl-4 space-y-1">
                       {swot.threats.map((s, i) => <li key={i} className="text-xs text-slate-700 dark:text-slate-300">{s}</li>)}
                     </ul>
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );

  const renderVisuals = () => {
    // Data for Feature Count Bar Chart
    const featureCountData = [report.primaryUrl, ...report.competitors].map(url => ({
      name: getHostname(url),
      count: report.features.filter(f => f.availability[url] === true).length,
    }));

    // Data for Market Positioning Scatter Chart
    const positioningData = Object.entries(report.market_positioning).map(([url, pos], idx) => ({
      name: getHostname(url),
      x: pos.x,
      y: pos.y,
      z: 100, // Bubble size
      fill: COLORS[idx % COLORS.length]
    }));

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Count Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print-break-inside-avoid">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Feature Density Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureCountData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#475569" opacity={0.2} />
                  <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                    {featureCountData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.name.includes(getHostname(report.primaryUrl)) ? '#2563eb' : '#64748b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Positioning Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print-break-inside-avoid">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Market Positioning</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#475569" opacity={0.2} />
                  <XAxis type="number" dataKey="x" name="Innovation" unit="%" domain={[0, 100]} tick={{ fill: '#94a3b8' }} label={{ value: 'Innovation Score', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis type="number" dataKey="y" name="Presence" unit="%" domain={[0, 100]} tick={{ fill: '#94a3b8' }} label={{ value: 'Market Presence', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Scatter name="Companies" data={positioningData} fill="#8884d8">
                    {positioningData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Scatter>
                  <Legend />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSeo = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-950">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Metric</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 dark:border-blue-500">
              {getHostname(report.primaryUrl)}
            </th>
            {report.competitors.map((url, idx) => (
              <th key={idx} className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {getHostname(url)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {[
            { label: 'Performance Score', key: 'page_speed_score', icon: Gauge, format: (v: any) => <span className={`font-bold ${v > 80 ? 'text-green-600' : v > 50 ? 'text-amber-500' : 'text-red-500'}`}>{v}/100</span> },
            { label: 'Mobile Friendly', key: 'mobile_friendly', icon: Smartphone, format: (v: any) => v ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-red-500 mx-auto" /> },
            { label: 'Blog Freshness', key: 'blog_freshness', icon: Globe, format: (v: any) => <span className={`text-xs px-2 py-1 rounded-full ${v === 'High' ? 'bg-green-100 text-green-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{v}</span> },
            { label: 'Meta Health', key: 'meta_description_health', icon: Search, format: (v: any) => <span className="text-sm text-slate-700 dark:text-slate-300">{v}</span> },
          ].map((metric, mIdx) => (
            <tr key={mIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                <metric.icon className="w-4 h-4 mr-2 text-slate-400" />
                {metric.label}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50/10 dark:bg-blue-900/10">
                {(() => {
                  const signal = report.seo.find(s => s.url === report.primaryUrl);
                  return signal ? metric.format(signal[metric.key as keyof typeof signal]) : '-';
                })()}
              </td>
              {report.competitors.map((url, cIdx) => (
                <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-center">
                  {(() => {
                    const signal = report.seo.find(s => s.url === url);
                    return signal ? metric.format(signal[metric.key as keyof typeof signal]) : '-';
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Competitor Analysis Report</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">Completed</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Generated on {new Date(report.timestamp).toLocaleDateString()} • ID: {report.id.slice(0, 8)}</p>
          </div>
          <div className="flex gap-3 no-print">
            <button 
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" /> 
              {copySuccess ? 'Copied!' : 'Share'}
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6 p-5 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 rounded-lg border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" /> Executive Summary
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{report.summary}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {[
            { id: 'matrix', label: 'Feature Matrix', icon: Zap },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'strategy', label: 'Strategy & SWOT', icon: Target },
            { id: 'visuals', label: 'Visual Insights', icon: BarChart2 },
            { id: 'seo', label: 'SEO Signals', icon: Search },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'}
              `}
            >
              <tab.icon className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'}
              `} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'matrix' && renderMatrix()}
        {activeTab === 'pricing' && renderPricing()}
        {activeTab === 'strategy' && renderStrategy()}
        {activeTab === 'visuals' && renderVisuals()}
        {activeTab === 'seo' && renderSeo()}
      </div>

      {/* Recommendations Footer */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-6 mt-8 print-break-inside-avoid">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-400 mb-4 flex items-center">
          <ArrowUpRight className="w-5 h-5 mr-2" /> Strategic Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {report.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start bg-white dark:bg-slate-900 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 shadow-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold mr-3">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportView;