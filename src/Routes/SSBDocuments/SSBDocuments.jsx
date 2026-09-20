import { useState } from 'react';
import { FileCheck, Shield, AlertTriangle, Download, CheckCircle2, FileText, Info } from 'lucide-react';

export const SSBDocuments = () => {
  const [activeCategory, setActiveCategory] = useState('common');

  const DOCUMENT_GROUPS = [
    {
      id: 'common',
      title: 'Mandatory Common Documents (All Entries)',
      items: [
        { name: 'SSB Call-Up Letter', desc: 'Original call letter issued by Selection Board (Service Selection Center).' },
        { name: 'Class 10th Certificate & Marksheet', desc: 'Proof of Date of Birth (DOB). Original + 3 self-attested copies.' },
        { name: 'Class 12th Certificate & Marksheet', desc: 'Proof of 10+2 stream qualification. Original + 3 self-attested copies.' },
        { name: 'Government Photo ID Proof', desc: 'Aadhaar Card / Voter ID / Passport / Driving License (Original).' },
        { name: 'Passport Size Photographs', desc: '20 recent passport-size photographs with light background (white shirt).' },
        { name: 'Personal Information Questionnaire (PIQ)', desc: '2 copies of duly filled PIQ forms as per board instructions.' },
      ],
    },
    {
      id: 'graduate',
      title: 'Graduate & Technical Entries (CDS, AFCAT, TGC, SSC Tech, JAG)',
      items: [
        { name: 'Graduation Degree / Provisional Degree', desc: 'Original degree certificate issued by recognized University.' },
        { name: 'All Semester Marksheets', desc: 'Individual marksheets of 1st to final semester / year.' },
        { name: 'Bonafide Certificate', desc: 'For final year students stating completion before course commencement date.' },
        { name: 'CGPA to Percentage Conversion Certificate', desc: 'Issued by Registrar/Principal for university grade evaluation.' },
        { name: 'No-Claim Certificate', desc: 'Declaration signed by candidate and parent/guardian.' },
      ],
    },
    {
      id: 'special',
      title: 'Specialized & Direct Entries (NCC, JAG, TA, Tattoo)',
      items: [
        { name: 'NCC "C" Certificate', desc: 'Original NCC Senior Division "C" Certificate with minimum B Grade (for NCC Entry).' },
        { name: 'Bar Council Registration / LLB Degree', desc: 'For JAG (Judge Advocate General) entry candidates.' },
        { name: 'Tattoo Certificate (Self-Declaration)', desc: 'Declaration specifying permanent body tattoo location and dimensions.' },
        { name: 'Traveling Allowance (TA) Form', desc: 'Bank passbook copy + cancelled cheque for 1st-timer train fare reimbursement.' },
        { name: 'Risk / Medical Fitness Certificate', desc: 'Medical fitness declaration for GTO obstacle tasks.' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-sans tracking-tight mb-4">
            SSB Interview Document Checklist
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-sans font-medium">
            Complete verification guide for NDA, CDS, AFCAT, TES, TGC, NCC, and JAG entry candidates attending SSB Interview boards.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex items-start gap-4 shadow-xs">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 font-sans leading-relaxed">
            <strong className="font-bold text-slate-900 block mb-1">Important Board Protocol:</strong>
            Failing to produce original certificates or required certificates will lead to immediate <strong>Document-Out</strong> status on Day 1 Screening. Ensure all names across certificates match your government ID.
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {DOCUMENT_GROUPS.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setActiveCategory(grp.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === grp.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {grp.title.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Active Checklist Group */}
        {DOCUMENT_GROUPS.filter((g) => g.id === activeCategory).map((group) => (
          <div key={group.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-sans border-b border-slate-100 pb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              {group.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 hover:border-amber-400 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-sans mb-1">{item.name}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SSBDocuments;
