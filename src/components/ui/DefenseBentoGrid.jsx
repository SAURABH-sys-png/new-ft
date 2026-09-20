'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChatCircle,
  Brain,
  Database,
  TerminalWindow,
  Code,
  FileText,
  SlackLogo,
  NotionLogo,
  Check,
  CircleNotch,
  Clock,
  Minus,
  Globe,
} from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

import { useNavigate } from 'react-router-dom';

export function FeatCard({ title, description, children, className = '', onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex flex-col gap-2.5 overflow-hidden rounded-[24px] p-5 border border-slate-200/90',
        'bg-white text-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.03),0_1px_3px_rgba(15,23,42,0.02)]',
        'hover:border-blue-500/80 hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        className
      )}
    >
      <div className="z-10 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm tracking-tight font-sans flex items-center gap-2 group-hover:text-blue-600 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shadow-2xs"></span>
            {title}
          </h3>
          <span className="text-[9.5px] font-mono font-bold tracking-widest text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80 uppercase group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center gap-1">
            EXPLORE INFO <Globe className="w-3 h-3 inline" />
          </span>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed max-w-[95%] font-medium">{description}</p>
      </div>
      <div className="relative mt-2 flex-1 w-full rounded-[16px] overflow-hidden border border-slate-200/70 bg-slate-50/80 p-2.5">
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Card 1 – SSB Selection Flow (Graph Node Pipeline)
───────────────────────────────────────────── */
const VW = 320;
const VH = 240;

const NODES = [
  { id: 'A', x: 50, y: 120, icon: ChatCircle, label: 'OIR/PPDT', type: 'box' },
  { id: 'Router', x: 125, y: 120, type: 'circle' },
  { id: 'C', x: 200, y: 120, icon: Brain, label: 'STAGE II', type: 'box' },
  { id: 'B', x: 280, y: 50, icon: Database, label: 'PSYCH/GTO', type: 'box' },
  { id: 'D', x: 280, y: 190, icon: TerminalWindow, label: 'BOARD', type: 'box' },
];

const PATHS = [
  { id: 'a-to-router', d: 'M 78 120 L 113 120', activeSteps: ['screening'], flowDirection: 'forward', colorClass: 'text-amber-500' },
  { id: 'router-to-agent', d: 'M 137 120 L 172 120', activeSteps: ['psych'], flowDirection: 'forward', colorClass: 'text-amber-600' },
  { id: 'agent-to-memory', d: 'M 200 92 L 200 50 L 252 50', activeSteps: ['gto'], flowDirection: 'both', colorClass: 'text-amber-700' },
  { id: 'agent-to-tools', d: 'M 200 148 L 200 190 L 252 190', activeSteps: ['interview'], flowDirection: 'both', colorClass: 'text-emerald-600' },
  { id: 'response-flow-1', d: 'M 172 120 L 137 120', activeSteps: ['conference'], flowDirection: 'forward', colorClass: 'text-amber-500' },
  { id: 'response-flow-2', d: 'M 113 120 L 78 120', activeSteps: ['recommendation'], flowDirection: 'forward', colorClass: 'text-emerald-500' },
];

const NODE_COLORS = {
  A: { buttonBg: 'bg-amber-500', buttonBorder: 'border-amber-600' },
  Router: { buttonBg: 'bg-slate-800', buttonBorder: 'border-slate-900' },
  C: { buttonBg: 'bg-amber-600', buttonBorder: 'border-amber-700' },
  B: { buttonBg: 'bg-slate-700', buttonBorder: 'border-slate-800' },
  D: { buttonBg: 'bg-emerald-600', buttonBorder: 'border-emerald-700' },
};

export function Card1() {
  const [step, setStep] = useState('screening');

  useEffect(() => {
    const steps = ['screening', 'psych', 'gto', 'interview', 'conference', 'recommendation'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setStep(steps[idx]);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const isNodeActive = (nodeId) => {
    switch (step) {
      case 'screening': return nodeId === 'A';
      case 'psych': return nodeId === 'Router';
      case 'gto': return nodeId === 'C' || nodeId === 'B';
      case 'interview': return nodeId === 'C' || nodeId === 'D';
      case 'conference': return nodeId === 'C' || nodeId === 'Router';
      case 'recommendation': return true;
      default: return false;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-slate-50/80 rounded-xl flex items-center justify-center p-2">
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <pattern id="clean-grid-light" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.85" fill="currentColor" className="text-slate-300" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#clean-grid-light)" />
      </svg>

      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
        <path d="M 78 120 L 113 120" fill="none" stroke="currentColor" className="text-slate-300" strokeWidth="1.5" />
        <path d="M 137 120 L 172 120" fill="none" stroke="currentColor" className="text-slate-300" strokeWidth="1.5" />
        <path d="M 200 92 L 200 50 L 252 50" fill="none" stroke="currentColor" className="text-slate-300" strokeWidth="1.5" />
        <path d="M 200 148 L 200 190 L 252 190" fill="none" stroke="currentColor" className="text-slate-300" strokeWidth="1.5" />

        {PATHS.map((p) => {
          const isActive = p.activeSteps.includes(step);
          if (!isActive) return null;

          return (
            <g key={p.id}>
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                className={p.colorClass}
                strokeWidth="3.5"
                strokeOpacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                className={p.colorClass}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </g>
          );
        })}

        {NODES.map((node) => {
          const isBox = node.type === 'box';
          const w = isBox ? 58 : 24;
          const h = isBox ? 58 : 24;
          const isActive = isNodeActive(node.id);
          const colorStyles = NODE_COLORS[node.id];

          return (
            <foreignObject key={node.id} x={node.x - w / 2} y={node.y - h / 2} width={w} height={h} className="overflow-visible">
              <div className="w-full h-full flex items-center justify-center">
                {isBox && node.icon ? (
                  <div className={`w-full h-full rounded-[14px] border flex flex-col items-center justify-center text-white ${colorStyles.buttonBg} ${colorStyles.buttonBorder} shadow-sm`}>
                    <node.icon className="w-5 h-5 mb-0.5" weight="fill" />
                    <span className="text-[8.5px] font-mono font-bold tracking-wider">{node.label}</span>
                  </div>
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-amber-100 border-amber-500' : 'bg-white border-slate-300'}`}>
                    <motion.div
                      className={`w-2.5 h-2.5 rounded-full border border-dashed ${isActive ? 'border-amber-600' : 'border-slate-400'}`}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    />
                  </div>
                )}
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 2 – Defense Cutoff & Eligibility Monitor
───────────────────────────────────────────── */
export function Card2() {
  const bars = [60, 85, 45, 90, 70, 95, 80];
  const entries = ['NDA', 'CDS', 'AFCAT', 'INET', 'TES', 'TGC', 'NCC'];

  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-between">
      <div className="flex gap-3 pt-1">
        {[
          { label: 'Eligible Schemes', value: '4 Entries', trend: '100% Match' },
          { label: 'Air Force Flying', value: 'Recommended', trend: 'PABT Ready' },
        ].map((s, i) => {
          const isActive = i === activeIdx || hoveredIdx === i;

          return (
            <div key={i} className="flex-1 h-[74px] relative select-none">
              <div
                className="absolute inset-0 rounded-xl border border-slate-200 bg-slate-100/50 text-slate-300"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)' }}
              />
              <motion.div
                className="absolute inset-0 w-full h-full rounded-xl bg-white border border-slate-200 p-2.5 flex items-center justify-between gap-2 shadow-sm cursor-pointer"
                animate={{ x: isActive ? '0.25rem' : '0rem', y: isActive ? '-0.25rem' : '0rem' }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[8.5px] text-slate-500 font-mono uppercase tracking-widest font-semibold">{s.label}</span>
                  <span className="text-sm font-bold font-mono text-slate-900 mt-1">{s.value}</span>
                  <span className="text-[8px] font-mono font-bold text-emerald-600 mt-1">{s.trend}</span>
                </div>
                <div className="w-10 h-6 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 48 24">
                    <motion.path
                      d={i === 0 ? 'M 0 18 L 16 11 L 32 14 L 48 4' : 'M 0 4 L 16 12 L 32 8 L 48 18'}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </svg>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex items-end gap-2 px-0.5 min-h-[85px]">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 h-full rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-amber-500 border-t border-amber-600 rounded-t-[8px]"
              initial={{ height: '0%' }}
              animate={{
                height: [`${h}%`, `${Math.min(95, h + 12)}%`, `${Math.max(20, h - 15)}%`, `${h}%`],
              }}
              transition={{ repeat: Infinity, duration: 3.5 + (i % 3) * 0.8, ease: 'easeInOut', delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 px-0.5">
        {entries.map((d, i) => (
          <p key={i} className="flex-1 text-center text-[8.5px] text-slate-600 font-mono font-bold">{d}</p>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 3 – Stacked 5-Day SSB Live Feed
───────────────────────────────────────────── */
const STATUS_ICONS = {
  done: { icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'bg-emerald-600', border: 'border-emerald-700' },
  running: { icon: CircleNotch, color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'bg-amber-500', border: 'border-amber-600' },
  waiting: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'bg-blue-600', border: 'border-blue-700' },
  idle: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-100', gradient: 'bg-slate-400', border: 'border-slate-500' },
};

export function Card3() {
  const logs = [
    { stage: 'Day 1: Screening', task: 'OIR Test & PPDT Story Writing', status: 'done', t: 'Cleared' },
    { stage: 'Day 2: Psych Tests', task: 'TAT, WAT (60 words), SRT (60 situations), SDT', status: 'done', t: 'Completed' },
    { stage: 'Day 3: GTO Day 1', task: 'GD, GPE, PGT, HGT, Lecturing', status: 'running', t: 'In Progress' },
    { stage: 'Day 4: GTO Day 2', task: 'Individual Obstacles & Command Task', status: 'waiting', t: 'Queued' },
    { stage: 'Day 5: Board Conf.', task: 'Final Officer Recommendation Board', status: 'idle', t: 'Upcoming' },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % logs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [logs.length]);

  const getSlot = (i) => {
    const N = logs.length;
    let rel = i - activeIdx;
    if (rel > Math.floor(N / 2)) rel -= N;
    if (rel < -Math.floor(N / 2)) rel += N;
    return rel;
  };

  const Y = { '-2': -65, '-1': -35, '0': 0, '1': 35, '2': 65 };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {logs.map((l, i) => {
        const slot = getSlot(i);
        const si = STATUS_ICONS[l.status];
        const abs = Math.abs(slot);
        const isActive = slot === 0;
        const isVisible = abs <= 2;

        const yOffset = Y[String(slot)] ?? (slot < 0 ? -120 : 120);
        const scale = isActive ? 1 : abs === 1 ? 0.94 : 0.88;
        const opacity = isActive ? 1 : abs === 1 ? 0.7 : 0.4;
        const zIndex = isActive ? 30 : abs === 1 ? 20 : 10;

        return (
          <motion.div
            key={l.stage}
            className="absolute left-0 right-0 mx-auto px-1.5"
            style={{ zIndex }}
            animate={{
              y: isVisible ? yOffset : slot < 0 ? -150 : 150,
              scale,
              opacity: isVisible ? opacity : 0,
            }}
            transition={{
              y: { type: 'spring', stiffness: 450, damping: 32 },
              scale: { type: 'spring', stiffness: 450, damping: 32 },
              opacity: { duration: 0.25 },
            }}
          >
            <div className={`w-full rounded-xl border flex items-center gap-2.5 ${isActive ? 'px-3 py-2.5 bg-white border-amber-300 shadow-sm' : 'px-2.5 py-1.5 bg-slate-100/70 border-slate-200'}`}>
              <div className={`shrink-0 rounded-md flex items-center justify-center text-white ${si.gradient} ${isActive ? 'w-8 h-8' : 'w-5 h-5'}`}>
                <si.icon weight="bold" className={`${isActive ? 'w-4 h-4' : 'w-3 h-3'} ${l.status === 'running' ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono font-bold text-slate-900 ${isActive ? 'text-[11px]' : 'text-[9.5px]'}`}>{l.stage}</span>
                  <span className={`font-mono uppercase px-1.5 py-0.5 rounded text-[7.5px] font-bold ${si.bg} ${si.color}`}>{l.status}</span>
                </div>
                {isActive && <p className="text-[9.5px] text-slate-600 truncate mt-0.5 font-medium">{l.task}</p>}
              </div>
              {isActive && <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{l.t}</span>}
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
        {logs.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full bg-amber-500"
            animate={{ width: i === activeIdx ? 14 : 4, opacity: i === activeIdx ? 0.9 : 0.3 }}
            style={{ height: 3 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 4 – 15 OLQs & Defense Knowledge Base
───────────────────────────────────────────── */
const NS_ICONS = {
  factor1: Brain,
  factor2: FileText,
  factor3: SlackLogo,
  factor4: NotionLogo,
};

const NS_COLORS = {
  factor1: { bar: 'from-amber-500 to-amber-600', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-900' },
  factor2: { bar: 'from-blue-500 to-blue-600', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-900' },
  factor3: { bar: 'from-emerald-500 to-emerald-600', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-900' },
  factor4: { bar: 'from-purple-500 to-purple-600', dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-900' },
};

const OLQ_QUERIES = [
  { ns: 'factor1', q: 'Effective Intelligence & Practical Problem Solving', t: 'Factor I' },
  { ns: 'factor2', q: 'Social Adaptability & Group Cooperation Skills', t: 'Factor II' },
  { ns: 'factor3', q: 'Liveliness, Initiative & Self Confidence', t: 'Factor III' },
  { ns: 'factor4', q: 'Courage, Determination & Stamina Under Stress', t: 'Factor IV' },
];

export function Card4() {
  const namespaces = [
    { name: 'factor1', hits: '15 OLQs', fill: 90, label: 'Intellectual' },
    { name: 'factor2', hits: '4 Qualities', fill: 75, label: 'Social Bonding' },
    { name: 'factor3', hits: '3 Qualities', fill: 60, label: 'Dynamic Brain' },
    { name: 'factor4', hits: '4 Qualities', fill: 85, label: 'Grit & Courage' },
  ];

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % OLQ_QUERIES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const activeNs = OLQ_QUERIES[tick].ns;
  const recentQueries = [0, 1, 2, 3].map(
    (offset) => OLQ_QUERIES[(tick - offset + OLQ_QUERIES.length) % OLQ_QUERIES.length]
  );

  return (
    <div className="w-full h-full flex gap-4 py-1 px-2">
      <div className="flex-1 flex flex-col gap-2 min-w-0 pr-1">
        <p className="text-[8.5px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1">15 Officer Like Qualities (OLQs)</p>

        <div className="flex flex-col gap-2.5 flex-1">
          {namespaces.map((ns) => {
            const c = NS_COLORS[ns.name];
            const isActive = ns.name === activeNs;
            const Icon = NS_ICONS[ns.name] || Brain;

            return (
              <div key={ns.name} className="flex items-center gap-2.5">
                <div className={`flex items-center justify-center w-[30px] h-[30px] rounded-lg border transition-all ${isActive ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200'}`}>
                  <Icon size={14} weight={isActive ? 'fill' : 'regular'} />
                </div>
                <span className={`text-[9.5px] font-mono font-bold w-20 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{ns.label}</span>
                <div className="flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden relative">
                  <motion.div
                    className={`absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r ${c.bar}`}
                    animate={{ width: `${ns.fill}%`, opacity: isActive ? 1 : 0.4 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-700 w-12 text-right">{ns.hits}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-px bg-slate-200 shrink-0" />

      <div className="w-[160px] shrink-0 flex flex-col gap-1.5">
        <p className="text-[8.5px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1">SSB Evaluator Log</p>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {recentQueries.map((q, qi) => {
            const c = NS_COLORS[q.ns];
            return (
              <motion.div
                key={`${q.ns}-${qi}`}
                className="rounded-lg border border-slate-200 bg-white p-2 shadow-xs"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: qi === 0 ? 1 : 0.6, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[7px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${c.badge}`}>{q.t}</span>
                </div>
                <p className="text-[8.5px] text-slate-800 font-sans font-semibold truncate leading-tight">{q.q}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 5 – Test Series & Exam Inspector
───────────────────────────────────────────── */
export function Card5() {
  const tools = [
    { name: 'UPSC NDA Mock', calls: '320 Qs', icon: Globe, latency: '120 Min', color: 'bg-amber-500', borderColor: 'border-amber-600' },
    { name: 'UPSC CDS Paper', calls: '240 Qs', icon: TerminalWindow, latency: '120 Min', color: 'bg-slate-800', borderColor: 'border-slate-900' },
    { name: 'AFCAT EKT', calls: '100 Qs', icon: FileText, latency: '45 Min', color: 'bg-emerald-600', borderColor: 'border-emerald-700' },
    { name: 'SSB OIR Set', calls: '50 Qs', icon: Brain, latency: '30 Min', color: 'bg-amber-600', borderColor: 'border-amber-700' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-2 gap-2 w-full">
        {tools.map((t, i) => (
          <motion.div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-2.5 flex flex-col justify-between shadow-xs hover:border-amber-400 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-start justify-between">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${t.color}`}>
                <t.icon weight="fill" className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-mono font-bold text-slate-900">{t.calls}</span>
                <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest font-bold">Volume</span>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-slate-800 tracking-tight">{t.name}</span>
                <span className="text-[8px] font-mono text-amber-700 font-bold">{t.latency}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className={`h-full rounded-full ${t.color}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${80 - i * 15}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Defense Bento Grid
───────────────────────────────────────────── */
const DEFENSE_CARDS = [
  {
    slug: 'ssb-pipeline',
    title: 'SSB Selection Pipeline',
    description: 'Visualise candidate flow across Stage 1 Screening, Stage 2 Psych/GTO, and Board Recommendation.',
    visual: <Card1 />,
    colSpan: 'lg:col-span-1',
    height: 'h-[290px]',
  },
  {
    slug: 'eligibility-monitor',
    title: 'Eligibility & Cutoff Monitor',
    description: 'Track NDA & CDS age windows, flying branch requirements, and attempt limits.',
    visual: <Card2 />,
    colSpan: 'lg:col-span-1',
    height: 'h-[290px]',
  },
  {
    slug: '5-day-ssb-feed',
    title: '5-Day SSB Live Feed',
    description: 'Real-time schedule of PPDT, WAT, TAT, SRT, GTO obstacles, and Officer Interview.',
    visual: <Card3 />,
    colSpan: 'lg:col-span-1',
    height: 'h-[290px]',
  },
  {
    slug: 'olq-framework',
    title: '15 Officer Like Qualities (OLQs)',
    description: 'Semantic guidance across Factor I to IV qualities evaluated during SSB interviews.',
    visual: <Card4 />,
    colSpan: 'lg:col-span-2',
    height: 'h-[290px]',
  },
  {
    slug: 'test-series-inspector',
    title: 'Test Series Inspector',
    description: 'Monitor exam timing, subject speed, and score percentiles for defense written exams.',
    visual: <Card5 />,
    colSpan: 'lg:col-span-1',
    height: 'h-[290px]',
  },
];

export function DefenseBentoGrid({ className = '' }) {
  const navigate = useNavigate();

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full max-w-6xl mx-auto', className)}>
      {DEFENSE_CARDS.map((card, idx) => (
        <FeatCard
          key={idx}
          title={card.title}
          description={card.description}
          className={cn(card.colSpan, card.height)}
          onClick={() => navigate(`/workspace/${card.slug}`)}
        >
          {card.visual}
        </FeatCard>
      ))}
    </div>
  );
}

export default DefenseBentoGrid;
