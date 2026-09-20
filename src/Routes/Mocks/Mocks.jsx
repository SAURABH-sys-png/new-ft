import { useState } from 'react';
import { Search, Filter, Download, FileText, Calendar, Shield, BookOpen, CheckCircle, Tag } from 'lucide-react';
import downloadsData from '../../data/downloads.json';

export const Mocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedExam, setSelectedExam] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const types = ['All Types', 'PYQ', 'Mock Test', 'Answer Key'];
  const exams = ['All', 'NDA', 'CDS', 'AFCAT', 'SSB'];
  const years = ['All', '2026', '2025', '2024'];

  const filteredResources = downloadsData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.year.includes(searchQuery);
    const matchesType = selectedType === 'All Types' || item.category === selectedType;
    const matchesExam = selectedExam === 'All' || item.exam === selectedExam;
    const matchesYear = selectedYear === 'All' || item.year === selectedYear;

    return matchesSearch && matchesType && matchesExam && matchesYear;
  });

  const handleDownload = (item) => {
    // Generate simulated PDF download blob
    const content = `DEFENCE ROGER OFFICIAL RESOURCE\n\nTitle: ${item.title}\nExam: ${item.exam}\nYear: ${item.year}\nCategory: ${item.category}\n\nDescription:\n${item.description}\n\nSubjects Covered:\n${item.subjects.join(', ')}\n\n(c) DEFENCE ROGER - Founder Saurabh (AIR 496)`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-sans tracking-tight mb-4">
            PYQs & Mock Test Library
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-sans font-medium">
            Download verified UPSC NDA, CDS, AFCAT previous year question papers, mock tests, and official answer keys with detailed subject breakdowns.
          </p>
        </div>

        {/* Search & Filter Control Panel */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 mb-10 shadow-sm space-y-4">
          {/* Top Row: Search input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search papers, mocks, years (e.g. NDA 2026 GAT, CDS Mathematics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Bottom Row: Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Exam Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-amber-600" /> Exam:
              </span>
              {exams.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSelectedExam(ex)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedExam === ex
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Type Tabs & Year Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                {types.map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setSelectedType(tp)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      selectedType === tp
                        ? 'bg-white text-amber-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tp}
                  </button>
                ))}
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none"
              >
                <option value="All">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between mb-6 px-1 text-xs font-mono text-slate-500">
          <span>Showing <strong className="text-slate-900">{filteredResources.length}</strong> resources</span>
          <span>Source: <strong className="text-amber-700">downloads.json</strong></span>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag Row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-900 text-white">
                    {item.exam}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.year}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base font-sans group-hover:text-amber-700 transition-colors mb-2.5 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs leading-relaxed font-medium mb-4">
                  {item.description}
                </p>

                {/* Subject Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.subjects.map((sub) => (
                    <span key={sub} className="text-[9.5px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Footer Row */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {item.size}
                </span>

                <button
                  onClick={() => handleDownload(item)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs hover:scale-105 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mocks;
