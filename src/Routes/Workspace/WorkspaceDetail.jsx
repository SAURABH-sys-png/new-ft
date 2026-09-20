import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Brain,
  Award,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  Flame,
  Scale,
  Ruler,
  BookOpen,
  Compass,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Check,
  ChevronRight,
} from 'lucide-react';

const WORKSPACE_DATA = {
  'ssb-pipeline': {
    id: 'ssb-pipeline',
    badge: 'SELECTION PIPELINE',
    title: 'SSB Selection Pipeline Roadmap',
    subtitle: 'Visualise the complete 5-stage selection process from Day 0 Reporting to Day 5 Board Recommendation.',
    overview: 'The Services Selection Board (SSB) evaluates candidates over a rigorous 5-day assessment process across three independent technique dimensions: Psychological Tests, Ground Testing Officer (GTO) Tasks, and Personal Interview.',
    steps: [
      {
        num: '01',
        stage: 'Day 1: Stage 1 Screening',
        subtitle: 'Filter Test (Screening IN / Screened OUT)',
        desc: 'Candidates undergo Officer Intelligence Rating (OIR) test followed by Picture Perception and Discussion Test (PPDT). Only candidates who clear Stage 1 move forward to Stage 2.',
        details: [
          'OIR Verbal & Non-Verbal test sets (Target OIR 1 or 2).',
          'PPDT 1-minute hazy picture view + 4-minute story writing prompt.',
          '1-minute individual narration followed by 15-minute Group Discussion (GD).',
          'Results declaration within 2 hours: Screened IN candidates receive new chest numbers.',
        ],
        icon: Brain,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        num: '02',
        stage: 'Day 2: Stage 2 Psychological Tests',
        subtitle: 'Written Subconscious Projection Evaluation',
        desc: 'Administered under high time pressure to assess subconscious thoughts, natural responses, and core Officer Like Qualities (OLQs).',
        details: [
          'TAT (Thematic Apperception Test): 11 picture slides + 1 blank slide (4 mins per slide).',
          'WAT (Word Association Test): 60 rapid words displayed at 15-second intervals.',
          'SRT (Situation Reaction Test): 60 real military and social crisis situations in 30 minutes.',
          'SDT (Self Description Test): Written reflection on parents, teachers, friends, and self views.',
        ],
        icon: FileText,
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        num: '03',
        stage: 'Day 3 & 4: Outdoor GTO Tasks',
        subtitle: 'Group Testing Technique (Physical & Team Dynamics)',
        desc: 'The Ground Testing Officer evaluates group behavior, leadership, cooperation, and practical problem-solving using outdoor structures.',
        details: [
          'Group Discussion (GD) & Group Planning Exercise (GPE).',
          'Progressive Group Task (PGT) & Half Group Task (HGT) with ropes, planks, and ballis.',
          'Lecturette (3-minute presentation on assigned military/social topic).',
          'Individual Obstacles (10 physical tasks scored from 1 to 10 points) & Command Task.',
        ],
        icon: Users,
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        num: '04',
        stage: 'Day 1–4: Personal Interview',
        subtitle: '1-on-1 Interviewing Officer (IO) Assessment',
        desc: 'Conducted individually by the President or Vice-President of the Board to evaluate background, academic record, awareness, and maturity.',
        details: [
          'Personal Information Questionnaire (PIQ) form verification.',
          'Rapid-fire question sequences covering family, education, sports, and achievements.',
          'General awareness, Defense Forces knowledge, and current geopolitical affairs.',
          'Cross-examination of decision-making under stress.',
        ],
        icon: Target,
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      },
      {
        num: '05',
        stage: 'Day 5: Board Conference & Results',
        subtitle: 'Tri-Service Assessor Consensus & Recommendation',
        desc: 'All three assessors (Psychologist, GTO, and Interviewing Officer) sit together with the Board President to pool findings and make the final recommendation.',
        details: [
          'Candidate appears individually before the Board of Officers for 2-5 minutes.',
          'Discussions held for borderline candidates requiring consensus.',
          'Final recommendation results declared by the Board Officer.',
          'Recommended candidates proceed for Medical Examination at Military Hospitals.',
        ],
        icon: Award,
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      },
    ],
    ctaText: 'Launch SSB Suite Simulators',
    ctaLink: '/#ssb-prep',
  },
  'eligibility-monitor': {
    id: 'eligibility-monitor',
    badge: 'ELIGIBILITY & CUTOFFS',
    title: 'Defense Schemes Eligibility & Cutoff Monitor',
    subtitle: 'Comprehensive entry rules, precise age cutoffs, attempt limits, and physical criteria across 15+ Armed Forces entry schemes.',
    overview: 'Determining exact eligibility requires calculating your age down to months & days against official UPSC/Defense Notification cutoff dates, verifying educational stream requirements, and checking physical height/vision benchmarks.',
    steps: [
      {
        num: '01',
        stage: 'UPSC NDA (National Defence Academy)',
        subtitle: 'Army, Navy & Air Force (10+2 Entry)',
        desc: 'Open to unmarried male and female candidates who passed 10+2. Math & Physics mandatory for Navy and Air Force branches.',
        details: [
          'Age Limits: 16.5 to 19.5 years at entry commencement.',
          'Education: 12th Pass or appearing (Physics & Maths required for IAF & Navy).',
          'Attempts: 2 attempts per year (NDA I in April, NDA II in Sept).',
          'Height: 157.5 cm (Army/Navy), 162.5 cm (Air Force Flying).',
        ],
        icon: ShieldCheck,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        num: '02',
        stage: 'UPSC CDS (Combined Defence Services)',
        subtitle: 'Graduation Entry (IMA, INA, AFA & OTA)',
        desc: 'Written exam followed by direct SSB for graduates aiming for Permanent Commission or Short Service Commission.',
        details: [
          'IMA (Army): Age 19-24 years, Degree from recognized University.',
          'INA (Navy): Age 19-24 years, B.E. / B.Tech Engineering Degree.',
          'AFA (Air Force): Age 19-24 years, Graduation with Physics & Math at 10+2 or B.E.',
          'OTA (Officer Training Academy): Age 19-25 years, Unmarried/Married, Any Degree.',
        ],
        icon: Award,
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        num: '03',
        stage: 'IAF AFCAT (Air Force Common Admission Test)',
        subtitle: 'Flying & Ground Duty (Tech & Non-Tech)',
        desc: 'Direct online exam conducted twice a year by the Indian Air Force for Officers in Flying, Technical, and Logistics/Administration branches.',
        details: [
          'Flying Branch: Age 20-24 years, Min 60% in Math & Physics at 10+2 + B.E./Graduation.',
          'Ground Duty Tech: Age 20-26 years, Min 60% aggregate in 4-yr Engineering Degree.',
          'Ground Duty Non-Tech: Age 20-26 years, Min 60% in Graduation (B.Com/BBA/B.Sc/BA).',
          'Mandatory PABT/CPSS test for Flying Branch aspirants.',
        ],
        icon: Compass,
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        num: '04',
        stage: 'Direct Entries: TES, TGC & JAG',
        subtitle: 'Direct SSB Calls without Written Exams',
        desc: 'Cutoff-based direct SSB invitations based on JEE Main ranks, B.Tech percentage, or LLB marks.',
        details: [
          '10+2 TES (Technical Entry Scheme - Army): Min 60% PCM in 12th + JEE Main appearance.',
          'TGC (Technical Graduate Course - Army): Final year Engineering / B.Tech Graduates.',
          'JAG (Judge Advocate General): LLB Degree with min 55% + CLAT PG Score.',
          'NCC Special Entry: C-Certificate holders with min B grade + 50% in Graduation.',
        ],
        icon: Target,
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      },
    ],
    ctaText: 'Use Dynamic Eligibility Calculator',
    ctaLink: '/calculator',
  },
  '5-day-ssb-feed': {
    id: '5-day-ssb-feed',
    badge: 'LIVE FEED & TIMETABLE',
    title: '5-Day SSB Live Feed & Workstation Guide',
    subtitle: 'Hour-by-hour schedule, rules, tactics, and simulator instructions for every day at the Selection Board.',
    overview: 'Understanding the exact timetable and workstation guidelines prevents anxiety, allows strategic mental pacing, and helps candidates deliver optimal performance across all 5 days.',
    steps: [
      {
        num: 'Day 1',
        stage: 'Reporting & Stage 1 Screening Test',
        subtitle: 'Morning 06:00 AM to 02:00 PM',
        desc: 'Testing begins immediately after breakfast. High concentration required for rapid verbal reasoning and crisp story writing.',
        details: [
          '06:30 AM: Verification of Call Letter, Original Marksheets, ID proofs & PIQ filling.',
          '08:30 AM: OIR Test (Set 1 & Set 2 - 40 to 50 questions each, 17-20 mins).',
          '10:00 AM: PPDT Image projection (30 seconds view + 1 minute character logging + 4 minutes story writing).',
          '11:30 AM: Group Discussion in batches of 15 candidates with 3 assessors.',
          '02:00 PM: Results declaration: Screened OUT candidates depart; Screened IN allocated new chest numbers.',
        ],
        icon: Clock,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        num: 'Day 2',
        stage: 'Psychological Test Battery',
        subtitle: 'Morning 07:30 AM to 11:30 AM',
        desc: 'Continuous 3-hour written psychological test battery without breaks. Requires natural, spontaneous responses.',
        details: [
          '08:00 AM: TAT (11 picture slides + 1 blank slide, 4 minutes per slide).',
          '09:00 AM: WAT (60 words displayed for 15 seconds each, instant sentence writing).',
          '09:30 AM: SRT (60 real situations booklet, 30 minutes timed timer).',
          '10:15 AM: SDT (Self Description Test writing - Parents, Teachers, Friends, Self views - 15 minutes).',
        ],
        icon: Brain,
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        num: 'Day 3',
        stage: 'GTO Tasks Day 1',
        subtitle: 'Morning 06:30 AM to 01:00 PM',
        desc: 'Outdoor ground testing in white PT uniform. Focus on active cooperation, practical ideas, and group harmony.',
        details: [
          'Group Discussion 1 & 2 (Current affairs & social issues topics).',
          'Group Planning Exercise (GPE - Map solution writing & group consensus plan).',
          'Progressive Group Task (PGT - 4 obstacles with plank, rope, and balli).',
          'Half Group Task (HGT) & Group Obstacle Race (Snake Race).',
          'Lecturette (3-minute individual speech from 4 card options).',
        ],
        icon: Users,
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        num: 'Day 4',
        stage: 'GTO Tasks Day 2 & Personal Interviews',
        subtitle: 'Morning 06:30 AM to 02:00 PM',
        desc: 'Individual performance tasks followed by scheduled 1-on-1 Personal Interviews with the Interviewing Officer.',
        details: [
          'Individual Obstacles (10 outdoor physical structures scored 1-10 points).',
          'Command Task (Candidate acts as Commander with 2 subordinates).',
          'Final Group Task (FGT - One consolidated group obstacle).',
          'Personal Interviews (Conducted after GTO tasks based on individual schedule slots).',
        ],
        icon: Target,
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      },
      {
        num: 'Day 5',
        stage: 'Board Conference & Recommendation',
        subtitle: 'Morning 08:30 AM to 01:00 PM',
        desc: 'Formal conference in officer uniform followed by result announcement and medical briefing.',
        details: [
          'Briefing by Board Vice-President on conference guidelines.',
          'Each candidate appears before all Board Officers for 2-5 minutes.',
          'Closing address and official results declared by the Selection Board Officer.',
          'Recommended candidates fill medical forms and receive hospital dates.',
        ],
        icon: Award,
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      },
    ],
    ctaText: 'Practice Timed Psychological Tests',
    ctaLink: '/#ssb-prep',
  },
  'olq-framework': {
    id: 'olq-framework',
    badge: '15 OLQS MASTERCLASS',
    title: 'The 15 Officer-Like Qualities (OLQs) Framework',
    subtitle: 'Deep-dive into the 4 core factor dimensions evaluated by the Psychologist, GTO, and Interviewing Officer.',
    overview: 'The Armed Forces Selection System evaluates candidates against 15 Officer Like Qualities divided into 4 core Factors. Assessors do not look for perfection, but for trainable potential and core moral integrity.',
    steps: [
      {
        num: 'Factor I',
        stage: 'Intellectual & Planning Qualities',
        subtitle: 'Head / Mind Dimension (Evaluated in Psych & GPE)',
        desc: 'Measures effective intelligence, logical reasoning under pressure, organizing skills, and lucidity of expression.',
        details: [
          'Effective Intelligence: Practical capacity to solve real-world problems with limited resources.',
          'Reasoning Ability: Ability to grasp cause-and-effect relationships logically without panicking.',
          'Organizing Ability: Systematic arrangement of available men and material to achieve goals.',
          'Power of Expression: Clear, lucid, and persuasive communication in speech and writing.',
        ],
        icon: Brain,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        num: 'Factor II',
        stage: 'Social Adaptability & Bonding',
        subtitle: 'Heart / Social Dimension (Evaluated in GD, PGT & Interview)',
        desc: 'Measures how seamlessly a candidate adapts to diverse environments, cooperates unselfishly, and takes responsibility.',
        details: [
          'Social Adaptability: Ability to mingle easily with people of varying backgrounds and temperaments.',
          'Cooperation: Spirit of unselfish teamwork and working collectively for group objectives.',
          'Sense of Responsibility: Duty-bound commitment to execute tasks without needing supervision.',
        ],
        icon: Users,
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        num: 'Factor III',
        stage: 'Dynamic & Moral Qualities',
        subtitle: 'Gut / Action Dimension (Evaluated in Command Task & SRT)',
        desc: 'Measures inner drive, initiative, speed of decision-making under stress, self-confidence, determination, and physical/moral courage.',
        details: [
          'Initiative: Spontaneous urge to take constructive action without waiting for external orders.',
          'Self Confidence: Unshakable faith in one’s own capabilities during crisis situations.',
          'Speed of Decision: Ability to arrive at sound, logical decisions swiftly under time constraints.',
          'Determination: Relentless perseverance to complete goals despite fatigue or setbacks.',
          'Courage: Ability to face danger or calculated risks with composure and bravery.',
        ],
        icon: Flame,
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        num: 'Factor IV',
        stage: 'Group Leadership & Effectiveness',
        subtitle: 'Limb / Influence Dimension (Evaluated in GTO & Lecturette)',
        desc: 'Measures how effectively a candidate influences group effort positively and coordinates team performance.',
        details: [
          'Group Influencing Ability: Capacity to command respect and direct group effort positively.',
          'Team Coordination: Managing interpersonal dynamics effectively to maintain group harmony.',
        ],
        icon: Target,
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      },
    ],
    ctaText: 'Explore OLQ Breakdown',
    ctaLink: '/#olq',
  },
  'test-series-inspector': {
    id: 'test-series-inspector',
    badge: 'TEST SERIES ANALYTICS',
    title: 'Defense Written Exam Test Series Inspector',
    subtitle: 'Speed analytics, negative marking strategies, subject volume monitors, and percentile benchmarks for NDA, CDS & AFCAT.',
    overview: 'Cracking defense written exams requires balancing speed, accuracy, and subject-wise sectional cutoffs while navigating negative marking schemes (1/3rd deduction).',
    steps: [
      {
        num: '01',
        stage: 'UPSC NDA Written Exam Inspector',
        subtitle: 'Paper 1 Mathematics (300 Marks) & Paper 2 GAT (600 Marks)',
        desc: 'Requires solving 120 Math questions in 150 minutes followed by 150 GAT questions covering English, Physics, Chemistry, History & Geography.',
        details: [
          'Math Paper: 120 Qs, +2.5 marks for correct, -0.83 for incorrect. Target 45+ accurate attempts.',
          'GAT Paper: 150 Qs, +4 marks for correct, -1.33 for incorrect. Focus on English (50 Qs) & Science.',
          'Sectional Cutoff: Minimum 25% marks in each individual paper.',
        ],
        icon: BookOpen,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        num: '02',
        stage: 'UPSC CDS Written Exam Inspector',
        subtitle: 'English (100 Marks), General Knowledge (100 Marks) & Elementary Maths (100 Marks)',
        desc: 'Conducted in 3 two-hour shifts for IMA/INA/AFA aspirants (2 shifts for OTA aspirants).',
        details: [
          'English Paper: 120 Qs in 120 minutes. High scoring area for boosting aggregate.',
          'GK Paper: 120 Qs covering Polity, Science, Economics & Defense Current Affairs.',
          'Math Paper: 100 Qs covering Arithmetic, Geometry, Trigonometry & Mensuration.',
          'Sectional Cutoff: Minimum 20% marks in each subject paper.',
        ],
        icon: FileText,
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        num: '03',
        stage: 'IAF AFCAT Online Exam Inspector',
        subtitle: '100 Questions / 300 Marks / 2 Hours',
        desc: 'Single computer-based test covering General Awareness, Verbal Ability, Numerical Ability, and Reasoning & Military Aptitude.',
        details: [
          'Scoring Pattern: +3 marks for correct answer, -1 mark for incorrect answer.',
          'Speed Target: Solve 100 questions in 120 minutes (avg 1.2 min per question).',
          'EKT (Engineering Knowledge Test): Additional 50 Qs in 45 mins for Technical Branch.',
        ],
        icon: BarChart3,
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
    ],
    ctaText: 'Access Online Test Series',
    ctaLink: '/test-series',
  },
};

export function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const data = WORKSPACE_DATA[id] || WORKSPACE_DATA['ssb-pipeline'];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveStepIdx(0);
  }, [id]);

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 font-body overflow-x-hidden pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP NAVIGATION BREADCRUMB */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-full shadow-2xs hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Back to Home Workspace</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">{data.badge}</span>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 mb-12 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-blue-50/70 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {data.badge} DETAILED GUIDE
            </span>
            <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="font-sans text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-medium">
              {data.subtitle}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Module Overview:</strong> {data.overview}
            </div>
          </div>
        </div>

        {/* STEP-BY-STEP VISUAL DETAILED BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-500 mb-4">
              Section Breakdown ({data.steps.length} Steps)
            </h3>

            {data.steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStepIdx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs ${
                        isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.num}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-sans font-bold text-sm truncate ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                        {step.stage}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-blue-600 translate-x-1' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Step Visual Detail Display */}
          <div className="lg:col-span-8">
            {data.steps[activeStepIdx] && (() => {
              const activeStep = data.steps[activeStepIdx];
              const StepIcon = activeStep.icon;

              return (
                <motion.div
                  key={activeStepIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${activeStep.badgeColor}`}>
                          STEP {activeStep.num}
                        </span>
                        <h3 className="font-sans font-bold text-xl sm:text-2xl text-slate-900 mt-1">
                          {activeStep.stage}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-6">
                    {activeStep.desc}
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Key Guidelines & Execution Details
                    </h4>
                    <ul className="space-y-3">
                      {activeStep.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTION CTA INSIDE DETAIL */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500 font-medium">
                      Need interactive practice? Access DefenceRoger tools.
                    </div>
                    <a
                      href={data.ctaLink}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>{data.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>

        {/* BOTTOM FULL WORKSPACE NAVIGATION FOOTER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-sans font-extrabold text-2xl text-white">Explore Other Defense Workspace Modules</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">Switch between eligibility monitors, 5-day live feeds, and OLQ masterclasses.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {Object.keys(WORKSPACE_DATA).map((key) => (
              <Link
                key={key}
                to={`/workspace/${key}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  key === id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {WORKSPACE_DATA[key].badge}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default WorkspaceDetail;
