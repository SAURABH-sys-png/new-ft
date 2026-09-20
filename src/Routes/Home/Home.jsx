import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, Sparkles, Award, Calculator, Brain, BookOpen, Compass, Activity, Scale, Ruler, XCircle, RefreshCw, Flame, Target, Mic, Eye, Play, Users, Database, FileText, ChevronRight, Clock, Star } from 'lucide-react';
import SlidingEaseVerticalBars from '../../components/hero/SlidingEaseVerticalBars';
import { checkEligibilityClient } from '../../hooks/api';
import ParallaxComponent from '../../components/ui/ParallaxComponent';
import DefenseBentoGrid from '../../components/ui/DefenseBentoGrid';

export const Home = () => {
    const [showPhysicalModal, setShowPhysicalModal] = useState(false);
    const [activeSSBStage, setActiveSSBStage] = useState('screening');
    const [selectedQuality, setSelectedQuality] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const state = location.state;
        const hash = location.hash;
        const targetId = state?.scrollTo || (hash ? hash.replace('#', '') : null);
        if (targetId) {
            setTimeout(() => {
                const elem = document.getElementById(targetId);
                if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    const FACTORS = [
        {
            factor: 'FACTOR I',
            title: 'Intellectual & Planning Qualities',
            icon: Brain,
            color: 'from-amber-50 to-orange-50 border-amber-200 text-amber-900',
            qualities: [
                { name: 'Effective Intelligence', desc: 'Ability to solve practical real-world problems using available resources under constraints.' },
                { name: 'Reasoning Ability', desc: 'Capacity to grasp cause-and-effect relationships logically and calmly under high pressure.' },
                { name: 'Organizing Ability', desc: 'Skill to arrange resources systematically and assign tasks to achieve group objectives.' },
                { name: 'Power of Expression', desc: 'Ability to communicate thoughts clearly, concisely, and persuasively in speech and writing.' },
            ],
        },
        {
            factor: 'FACTOR II',
            title: 'Social Adaptability & Bonding',
            icon: Users,
            color: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
            qualities: [
                { name: 'Social Adaptability', desc: 'Ability to adapt seamlessly to new environments, diverse people, and dynamic group situations.' },
                { name: 'Cooperation', desc: 'Attitude of unselfish participation and collective teamwork toward common group goals.' },
                { name: 'Sense of Responsibility', desc: 'Duty-bound commitment to execute assigned obligations faithfully with zero excuses.' },
            ],
        },
        {
            factor: 'FACTOR III',
            title: 'Dynamic & Moral Qualities',
            icon: Flame,
            color: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-900',
            qualities: [
                { name: 'Initiative', desc: 'Ability to originate constructive action spontaneously without waiting for external orders.' },
                { name: 'Self Confidence', desc: 'Unshakable faith in one’s own capabilities during unfamiliar or stressful challenges.' },
                { name: 'Speed of Decision', desc: 'Ability to arrive at sound, logical decisions swiftly under tight time constraints.' },
                { name: 'Determination', desc: 'Relentless perseverance to achieve goals despite obstacles, fatigue, or setbacks.' },
                { name: 'Courage', desc: 'Physical and moral bravery to accept calculated risks and face danger decisively.' },
            ],
        },
        {
            factor: 'FACTOR IV',
            title: 'Group Leadership & Effectiveness',
            icon: Target,
            color: 'from-purple-50 to-pink-50 border-purple-200 text-purple-900',
            qualities: [
                { name: 'Group Influencing Ability', desc: 'Capacity to lead, inspire, and direct group effort positively to achieve success.' },
                { name: 'Team Coordination', desc: 'Managing interpersonal dynamics effectively to maintain group harmony and focus.' },
            ],
        },
    ];

    const SAMPLE_STORIES = [
        {
            id: 'story-1',
            title: 'Disaster Relief & Bridge Reconstruction',
            category: 'Crisis',
            heroName: 'Captain Aniket, Engineer Regiment',
            olqsMapped: ['Effective Intelligence', 'Organizing Ability', 'Courage', 'Cooperation'],
            summary: 'Rushing to a flash flood site, Captain Aniket mobilized local villagers, established a temporary footbridge, provided medical aid, and restored connectivity within 6 hours.',
        },
        {
            id: 'story-2',
            title: 'Village Cleanliness & Water Harvesting Project',
            category: 'Social',
            heroName: 'Rohan, Final Year B.Tech Student',
            olqsMapped: ['Social Adaptability', 'Initiative', 'Group Influencing Ability'],
            summary: 'Rohan organized a village youth committee to clean the local pond and construct rainwater harvesting pits prior to the monsoon season.',
        },
        {
            id: 'story-3',
            title: 'High-Altitude Mountain Rescue Operation',
            category: 'Leadership',
            heroName: 'Lieutenant Varun, High Altitude Warfare School',
            olqsMapped: ['Speed of Decision', 'Determination', 'Self Confidence'],
            summary: 'Facing a sudden blizzard during a trek, Varun took command, established a snow-cave shelter, maintained group morale, and signaled for search parties.',
        },
    ];

    return (
        <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 font-body overflow-x-hidden pt-20">

            {/* 1. HERO SECTION (Full Page Canvas Background + Lenis Parallax) */}
            <ParallaxComponent>
                <section className="relative min-h-[85vh] sm:min-h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
                    <SlidingEaseVerticalBars backgroundColor="#F8FAFC" lineColor="#E2E8F0" barColor="#94A3B8" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full text-center">
                        {/* Huge DefenceRoger Text Title (No circular logo badge) */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="font-sans font-black tracking-tight text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-slate-900 leading-none mb-5"
                        >
                            Defence<span className="text-blue-600">Roger</span>
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="font-sans font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto"
                        >
                            KNOW YOUR ELIGIBILITY.{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                                OWN YOUR SSB.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className="font-sans text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed font-medium"
                        >
                            India’s most precise Defense Entry Scheme Eligibility Calculator and SSB Interview Preparation Hub for NDA, CDS, AFCAT, TES, TGC & JAG entries.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                        >
                            <a
                                href="/calculator"
                                className="w-full sm:w-auto px-9 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
                            >
                                <ShieldCheck className="w-5 h-5 text-blue-200" />
                                <span>Check Eligibility</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                                href="/signup"
                                className="w-full sm:w-auto px-9 py-4 rounded-full border border-slate-300 bg-white text-slate-900 font-bold text-base hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
                            >
                                <Award className="w-5 h-5 text-blue-600" />
                                <span>Free Account</span>
                            </a>
                        </motion.div>
                    </div>
                </section>
            </ParallaxComponent>

            {/* BENTO GRID FEATURE SUITE SECTION */}
            <section className="w-full pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200 scroll-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <h2 className="font-sans font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
                            Defense Preparation Workspace
                        </h2>
                        <p className="font-sans text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-medium">
                            Explore real-time selection pipelines, candidate cutoff monitors, 5-day SSB feeds, and 15 OLQ evaluation tools.
                        </p>
                    </div>

                    <DefenseBentoGrid />
                </div>
            </section>

            {/* 2. DYNAMIC ELIGIBILITY CALCULATOR FEATURE BANNER */}
            <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                                Defense Entry Eligibility Engine
                            </h2>
                            <p className="font-sans text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
                                Calculate your exact age down to months & days against official cutoff dates across 15+ entry schemes (NDA, CDS, AFCAT, TES, TGC, JAG, NCC Special Entry).
                            </p>
                            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span> 15+ Active Entry Schemes
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Attempt Counter
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span> Age & Qualification Diagnostics
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 shrink-0 w-full sm:w-auto text-center lg:text-right">
                            <a
                                href="/calculator"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-base transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 cursor-pointer"
                            >
                                <span>Launch Eligibility Calculator</span>
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SSB PREPARATION SUITE */}
            <section id="ssb-prep" className="w-full py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-slate-900 border-b border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-sans font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
                            Comprehensive SSB Preparation Suite
                        </h2>
                        <p className="font-body text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
                            Master every phase of the Services Selection Board interview with interactive simulators, timed psychological test environments, and GTO strategy frameworks.
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-md">
                            <button
                                onClick={() => setActiveSSBStage('screening')}
                                className={`px-6 py-3 rounded-xl font-accent text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                                    activeSSBStage === 'screening'
                                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Brain className="w-4 h-4 text-blue-200" /> Stage 1: Screening Test
                            </button>
                            <button
                                onClick={() => setActiveSSBStage('psych')}
                                className={`px-6 py-3 rounded-xl font-accent text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                                    activeSSBStage === 'psych'
                                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Clock className="w-4 h-4 text-blue-200" /> Stage 2: Psychological Test
                            </button>
                            <button
                                onClick={() => setActiveSSBStage('gto_pi')}
                                className={`px-6 py-3 rounded-xl font-accent text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                                    activeSSBStage === 'gto_pi'
                                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Users className="w-4 h-4 text-blue-200" /> GTO & Personal Interview
                            </button>
                        </div>
                    </div>

                    {activeSSBStage === 'screening' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:border-blue-500 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6">
                                    <Brain className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs font-accent text-blue-800 font-bold uppercase tracking-widest">TEST 1 • OIR TEST</span>
                                <h3 className="font-sans font-bold text-2xl text-slate-900 mt-1">Officer Intelligence Rating (OIR)</h3>
                                <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                                    Aim for OIR Rating 1! Practice verbal and non-verbal reasoning test sets designed on actual SSB question patterns with real-time time tracking.
                                </p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:border-blue-500 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6">
                                    <Award className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs font-accent text-blue-800 font-bold uppercase tracking-widest">TEST 2 • PPDT WORKSTATION</span>
                                <h3 className="font-sans font-bold text-2xl text-slate-900 mt-1">Picture Perception & Discussion Test</h3>
                                <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                                    Interactive simulator with 1-minute hazy image view timer, character logging (Age, Sex, Mood), 4-minute story writing prompt, and group discussion tactics.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeSSBStage === 'psych' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:border-blue-500 transition-all cursor-pointer">
                                <span className="text-[11px] font-accent text-blue-800 font-bold uppercase tracking-widest">STAGE 2 • PSYCH 1</span>
                                <h3 className="font-sans font-bold text-xl text-slate-900 mt-1">TAT (Thematic Apperception)</h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    11 picture slides + 1 blank slide presentation mode (4 mins/slide). Practice positive hero projection and OLQ alignment.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:border-blue-500 transition-all cursor-pointer">
                                <span className="text-[11px] font-accent text-blue-800 font-bold uppercase tracking-widest">STAGE 2 • PSYCH 2</span>
                                <h3 className="font-sans font-bold text-xl text-slate-900 mt-1">WAT (Word Association)</h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    60 words displayed at rapid 15-second intervals with automatic slide progression. Train natural positive responses.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:border-blue-500 transition-all cursor-pointer">
                                <span className="text-[11px] font-accent text-blue-800 font-bold uppercase tracking-widest">STAGE 2 • PSYCH 3</span>
                                <h3 className="font-sans font-bold text-xl text-slate-900 mt-1">SRT (Situation Reaction)</h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    60 real military and crisis situations with 30-minute countdown. Build practical, action-oriented decision skills.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. 15 OLQS FRAMEWORK */}
            <section id="olq" className="w-full py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-sans font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
                            The 15 Officer-Like Qualities Framework
                        </h2>
                        <p className="font-body text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-normal">
                            Understand the exact behavioral traits evaluated by the Assessors (Psychologist, GTO, and Interviewing Officer) across 4 core factors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {FACTORS.map((group, idx) => {
                            const Icon = group.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50"
                                >
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${group.color} border`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-accent text-slate-500 uppercase tracking-widest font-bold">{group.factor}</span>
                                            <h3 className="font-sans font-bold text-xl text-slate-900">{group.title}</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {group.qualities.map((item, qIdx) => (
                                            <div
                                                key={qIdx}
                                                onClick={() => setSelectedQuality(selectedQuality === item.name ? null : item.name)}
                                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                                    selectedQuality === item.name
                                                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-100'
                                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
                                                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] font-accent text-slate-500 font-medium">
                                                        {selectedQuality === item.name ? 'Collapse' : 'Expand'}
                                                    </span>
                                                </div>
                                                <p className={`text-xs text-slate-600 mt-2 leading-relaxed font-normal transition-all ${selectedQuality === item.name ? 'block' : 'hidden sm:block text-slate-500'}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PHYSICAL MODAL */}
            {showPhysicalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                            <h3 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-blue-600" />
                                Physical Standards & Medical Criteria
                            </h3>
                            <button
                                onClick={() => setShowPhysicalModal(false)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 text-xs font-body text-slate-700">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                                    <Scale className="w-4 h-4 text-amber-600" /> Height Requirements by Service
                                </h4>
                                <ul className="space-y-1.5 list-disc list-inside text-slate-700 leading-relaxed">
                                    <li><strong>Army (NDA / CDS):</strong> Minimum height 157.5 cm (Male), 152 cm (Female).</li>
                                    <li><strong>Navy (10+2 B.Tech / INA):</strong> Minimum height 157 cm (Male), 152 cm (Female).</li>
                                    <li><strong>Air Force Flying Branch:</strong> Minimum height 162.5 cm (Leg Length: 99-120 cm).</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setShowPhysicalModal(false)}
                                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow cursor-pointer hover:bg-slate-800"
                            >
                                Close Standards Guide
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
