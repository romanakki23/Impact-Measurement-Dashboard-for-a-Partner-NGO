'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, TrendingUp, IndianRupee, Target, Download } from 'lucide-react';

const TOTAL_PROGRAM_BUDGET = 240000; 
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [impactThreshold, setImpactThreshold] = useState(25); 

  // Ref for the PDF export area
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Papa.parse('/final_dashboard_data.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      }
    });
  }, []);

  const metrics = useMemo(() => {
    if (!data.length) return null;

    const filteredData = selectedVillage === 'All' 
      ? data 
      : data.filter(d => d.village === selectedVillage);

    const totalStudents = filteredData.length;
    const activeBudget = selectedVillage === 'All' 
      ? TOTAL_PROGRAM_BUDGET 
      : (TOTAL_PROGRAM_BUDGET / data.length) * totalStudents;

    const impactedStudents = filteredData.filter(d => d.pct_improvement >= impactThreshold);
    const impactCount = impactedStudents.length;
    const costPerImpact = impactCount > 0 ? (activeBudget / impactCount) : 0;

    const genderCount = impactedStudents.reduce((acc, curr) => {
      acc[curr.gender] = (acc[curr.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const pieData = Object.keys(genderCount).map(key => ({ name: key, value: genderCount[key] }));

    const bins = { '<0%': 0, '0-10%': 0, '11-20%': 0, '21-30%': 0, '>30%': 0 };
    filteredData.forEach(d => {
      if (d.pct_improvement < 0) bins['<0%']++;
      else if (d.pct_improvement <= 10) bins['0-10%']++;
      else if (d.pct_improvement <= 20) bins['11-20%']++;
      else if (d.pct_improvement <= 30) bins['21-30%']++;
      else bins['>30%']++;
    });
    const distData = Object.keys(bins).map(k => ({ range: k, count: bins[k as keyof typeof bins] }));

    const vCount = impactedStudents.reduce((acc, curr) => {
      acc[curr.village] = (acc[curr.village] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const villageData = Object.keys(vCount).map(k => ({ village: k, count: vCount[k] })).sort((a,b) => b.count - a.count);

    return { totalStudents, activeBudget, impactCount, costPerImpact, filteredData, pieData, distData, villageData };
  }, [data, selectedVillage, impactThreshold]);

// Handle PDF Export
  const handleExportPDF = () => {
    window.print();
  };
  if (loading || !metrics) return <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-300 text-xl">Loading Field Data...</div>;

  const tooltipStyle = { backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 font-sans text-slate-200">
      
      {/* Header & Controls (NOT included in PDF to keep report clean) */}
     
<div className="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white">Impact Measurement Dashboard</h1>
          <p className="text-slate-400 mt-1">Translating field activities into actionable outcomes.</p>
        </div>
        
        <div className="mt-6 md:mt-0 flex flex-wrap gap-6 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-400 mb-2">Filter by Village</label>
            <select 
              className="p-2.5 border border-slate-700 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
            >
              <option value="All">All Villages (Consolidated)</option>
              {Array.from(new Set(data.map(d => d.village))).map(v => (
                <option key={v as string} value={v as string}>{v as string}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col min-w-[200px]">
            <label className="text-sm font-semibold text-slate-400 mb-2 flex justify-between">
              <span>Impact Threshold:</span>
              <span className="text-blue-400 font-bold">{impactThreshold}%</span>
            </label>
            <input 
              type="range" min="5" max="50" step="5"
              value={impactThreshold}
              onChange={(e) => setImpactThreshold(Number(e.target.value))}
              className="w-full cursor-pointer accent-blue-500"
            />
          </div>

          {/* Export Button */}
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors h-[46px]"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* The Printable Report Area */}
      <div ref={reportRef} className="p-4 -m-4">
        {/* PDF Only Header (Hidden in UI, visible in PDF) */}
        <div className="hidden print:block mb-6 pb-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Impact Assessment Report</h2>
          <p className="text-slate-400">Generated for: {selectedVillage === 'All' ? 'All Villages' : selectedVillage} | Threshold: &gt;{impactThreshold}% Score Improvement</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Budget Spent" value={`₹${metrics.activeBudget.toLocaleString(undefined, {maximumFractionDigits: 0})}`} icon={<IndianRupee />} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-500/20" />
          <KpiCard title="Students Tracked" value={metrics.totalStudents} icon={<Users />} color="text-blue-400" bg="bg-blue-400/10" border="border-blue-500/20" />
          <KpiCard title={`Impacted Students (>${impactThreshold}%)`} value={metrics.impactCount} icon={<TrendingUp />} color="text-amber-400" bg="bg-amber-400/10" border="border-amber-500/20" />
          <KpiCard title="Cost per Impact" value={`₹${metrics.costPerImpact.toLocaleString(undefined, {maximumFractionDigits: 0})}`} icon={<Target />} color="text-indigo-400" bg="bg-indigo-400/10" border="border-indigo-500/20" />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6">Correlation: Attendance vs. Learning Outcome</h2>
            <div className="h-80 w-full"> 
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis type="number" dataKey="attendance_rate" name="Attendance (%)" domain={[0, 100]} stroke="#94a3b8" />
                  <YAxis type="number" dataKey="pct_improvement" name="Improvement (%)" stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} formatter={(val) => `${Number(val).toFixed(1)}%`} />
                  <Scatter name="Students" data={metrics.filteredData} fill="#3b82f6" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6">Distribution of Score Improvement</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.distData} margin={{ top: 10, right: 30, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{fill: '#334155', opacity: 0.4}} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6">Impacted Students by Village</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.villageData} margin={{ top: 10, right: 30, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                  <XAxis dataKey="village" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{fill: '#334155', opacity: 0.4}} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Impacted Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6">Impacted Demographics (Gender)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={metrics.pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {metrics.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#cbd5e1' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for printing */}
     
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:block { display: block !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}

function KpiCard({ title, value, icon, color, bg, border }: {title: string, value: string | number, icon: any, color: string, bg: string, border: string}) {
  return (
    <div className={`bg-slate-900 p-6 rounded-xl border ${border} shadow-sm flex items-center gap-5 transition-all hover:border-slate-600`}>
      <div className={`p-4 rounded-full ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-400 mb-1">{title}</p>
        <p className={`text-3xl font-bold text-white`}>{value}</p>
      </div>
    </div>
  );
}