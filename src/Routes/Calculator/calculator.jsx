import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  User,
  CircleAlert,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const INITIAL_PROFILE = {
  dob: '2004-08-15',
  age: '20.0',
  gender: 'Male',
  stream: 'PCM',
  hasJEE: true,
  degreeStatus: 'Completed',
  degreeType: 'B.Tech/B.E.',
  hasNCC: false,
};

const ENTRY_RULES = [
  {
    name: 'NDA (Army Wing)',
    group: 'NDA',
    type: '10+2 Entry',
    minAge: 15.5,
    maxAge: 18.5,
    condition: (p) => p.age >= 15.5 && p.age <= 18.5,
    getReason: (p) => {
      if (p.age < 15.5) return 'Underage for this entry.';
      if (p.age > 18.5) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'NDA (Navy & Air Force)',
    group: 'NDA',
    type: '10+2 Entry',
    minAge: 15.5,
    maxAge: 19.5,
    condition: (p) => p.age >= 15.5 && p.age <= 19.5 && p.stream === 'PCM',
    getReason: (p) => {
      if (p.stream !== 'PCM') return 'Requires PCM in 12th.';
      if (p.age < 15.5) return 'Underage for this entry.';
      if (p.age > 19.5) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'TES (Technical Entry Scheme - Army)',
    group: 'Technical',
    type: '10+2 B.Tech Entry',
    minAge: 16.5,
    maxAge: 19.5,
    condition: (p) => p.age >= 16.5 && p.age <= 19.5 && p.stream === 'PCM' && p.hasJEE && p.gender === 'Male',
    getReason: (p) => {
      if (p.stream !== 'PCM') return 'Requires PCM in 12th.';
      if (!p.hasJEE) return 'Requires PCM in 12th.';
      if (p.gender !== 'Male') return 'Male candidates only.';
      if (p.age < 16.5) return 'Underage for this entry.';
      if (p.age > 19.5) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: '10+2 B.Tech Cadet Entry (Navy)',
    group: 'Technical',
    type: '10+2 B.Tech Entry',
    minAge: 16.5,
    maxAge: 19.5,
    condition: (p) => p.age >= 16.5 && p.age <= 19.5 && p.stream === 'PCM' && p.hasJEE && p.gender === 'Male',
    getReason: (p) => {
      if (p.stream !== 'PCM') return 'Requires PCM in 12th.';
      if (!p.hasJEE) return 'Requires PCM in 12th.';
      if (p.gender !== 'Male') return 'Male candidates only.';
      if (p.age < 16.5) return 'Underage for this entry.';
      if (p.age > 19.5) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'CDS - IMA (Indian Military Academy)',
    group: 'CDS',
    type: 'Graduate Entry',
    minAge: 19,
    maxAge: 24,
    condition: (p) => p.age >= 19 && p.age <= 24 && (p.degreeStatus === 'Completed' || p.degreeStatus === 'Final Year') && p.gender === 'Male',
    getReason: (p) => {
      if (p.gender !== 'Male') return 'Underage for this entry.';
      if (p.degreeStatus === 'None' || p.degreeStatus === 'Pursuing') return 'Requires graduation or final-year status.';
      if (p.age < 19) return 'Underage for this entry.';
      if (p.age > 24) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'CDS - INA (Indian Naval Academy)',
    group: 'CDS',
    type: 'Graduate Entry',
    minAge: 19,
    maxAge: 24,
    condition: (p) => p.age >= 19 && p.age <= 24 && p.degreeType === 'B.Tech/B.E.' && p.gender === 'Male',
    getReason: (p) => {
      if (p.gender !== 'Male') return 'Underage for this entry.';
      if (p.degreeType !== 'B.Tech/B.E.') return 'Underage for this entry.';
      if (p.age < 19) return 'Underage for this entry.';
      if (p.age > 24) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'CDS - AFA (Air Force Academy)',
    group: 'CDS',
    type: 'Graduate Entry',
    minAge: 20,
    maxAge: 24,
    condition: (p) => p.age >= 20 && p.age <= 24 && (p.degreeType === 'B.Tech/B.E.' || p.stream === 'PCM') && p.gender === 'Male',
    getReason: (p) => {
      if (p.gender !== 'Male') return 'Underage for this entry.';
      if (p.stream !== 'PCM' && p.degreeType !== 'B.Tech/B.E.') return 'Underage for this entry.';
      if (p.age < 20) return 'Underage for this entry.';
      if (p.age > 24) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'CDS - OTA (Officers Training Academy)',
    group: 'CDS',
    type: 'Graduate Entry',
    minAge: 19,
    maxAge: 25,
    condition: (p) => p.age >= 19 && p.age <= 25 && (p.degreeStatus === 'Completed' || p.degreeStatus === 'Final Year'),
    getReason: (p) => {
      if (p.degreeStatus === 'None' || p.degreeStatus === 'Pursuing') return 'Requires graduation or final-year status.';
      if (p.age < 19) return 'Underage for this entry.';
      if (p.age > 25) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'AFCAT - Flying Branch',
    group: 'AFCAT',
    type: 'Graduate Entry',
    minAge: 20,
    maxAge: 24,
    condition: (p) => p.age >= 20 && p.age <= 24 && p.stream === 'PCM' && (p.degreeStatus === 'Completed' || p.degreeStatus === 'Final Year'),
    getReason: (p) => {
      if (p.stream !== 'PCM') return 'Requires PCM in 12th.';
      if (p.degreeStatus === 'None' || p.degreeStatus === 'Pursuing') return 'Underage for this entry.';
      if (p.age < 20) return 'Underage for this entry.';
      if (p.age > 24) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'AFCAT - Ground Duty (Technical)',
    group: 'AFCAT',
    type: 'Graduate Entry',
    minAge: 20,
    maxAge: 26,
    condition: (p) => p.age >= 20 && p.age <= 26 && p.stream === 'PCM' && p.degreeType === 'B.Tech/B.E.',
    getReason: (p) => {
      if (p.stream !== 'PCM') return 'Requires PCM in 12th.';
      if (p.degreeType !== 'B.Tech/B.E.') return 'Underage for this entry.';
      if (p.age < 20) return 'Underage for this entry.';
      if (p.age > 26) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'AFCAT - Ground Duty (Non-Technical)',
    group: 'AFCAT',
    type: 'Graduate Entry',
    minAge: 20,
    maxAge: 26,
    condition: (p) => p.age >= 20 && p.age <= 26 && (p.degreeStatus === 'Completed' || p.degreeStatus === 'Final Year'),
    getReason: (p) => {
      if (p.degreeStatus === 'None' || p.degreeStatus === 'Pursuing') return 'Underage for this entry.';
      if (p.age < 20) return 'Underage for this entry.';
      if (p.age > 26) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'TGC (Technical Graduate Course - Army)',
    group: 'Technical',
    type: 'Graduate Direct Entry',
    minAge: 20,
    maxAge: 27,
    condition: (p) => p.age >= 20 && p.age <= 27 && p.degreeType === 'B.Tech/B.E.' && p.gender === 'Male',
    getReason: (p) => {
      if (p.gender !== 'Male') return 'Underage for this entry.';
      if (p.degreeType !== 'B.Tech/B.E.') return 'Underage for this entry.';
      if (p.age < 20) return 'Underage for this entry.';
      if (p.age > 27) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'SSC Tech (Army)',
    group: 'Technical',
    type: 'Graduate Direct Entry',
    minAge: 20,
    maxAge: 27,
    condition: (p) => p.age >= 20 && p.age <= 27 && p.degreeType === 'B.Tech/B.E.',
    getReason: (p) => {
      if (p.degreeType !== 'B.Tech/B.E.') return 'Underage for this entry.';
      if (p.age < 20) return 'Underage for this entry.';
      if (p.age > 27) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'NCC Special Entry',
    group: 'Special Entry',
    type: 'Direct SSB Entry',
    minAge: 19,
    maxAge: 25,
    condition: (p) => p.age >= 19 && p.age <= 25 && (p.degreeStatus === 'Completed' || p.degreeStatus === 'Final Year') && p.hasNCC,
    getReason: (p) => {
      if (!p.hasNCC) return 'Underage for this entry.';
      if (p.degreeStatus === 'None' || p.degreeStatus === 'Pursuing') return 'Underage for this entry.';
      if (p.age < 19) return 'Underage for this entry.';
      if (p.age > 25) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
  {
    name: 'JAG (Judge Advocate General)',
    group: 'Special Entry',
    type: 'Direct SSB Entry',
    minAge: 21,
    maxAge: 27,
    condition: (p) => p.age >= 21 && p.age <= 27 && p.degreeType === 'LLB',
    getReason: (p) => {
      if (p.degreeType !== 'LLB') return 'Underage for this entry.';
      if (p.age < 21) return 'Underage for this entry.';
      if (p.age > 27) return 'Overage for this entry.';
      return 'Does not meet eligibility criteria.';
    }
  },
];

function calculateExactAgeFromDOB(dobString) {
  if (!dobString) return 20;
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  const dayDiff = Math.floor((now - dob) / (1000 * 60 * 60 * 24));
  return Math.round((dayDiff / 365.25) * 10) / 10;
}

export default function DefenseCalculator() {
  const [step, setStep] = useState(3);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [showParametersDrawer, setShowParametersDrawer] = useState(false);

  const numericAge = useMemo(() => {
    return Number(profile.age) || calculateExactAgeFromDOB(profile.dob);
  }, [profile.age, profile.dob]);

  const results = useMemo(() => {
    const currentProfile = { ...profile, age: numericAge };
    return ENTRY_RULES.map((entry) => {
      const eligible = entry.condition(currentProfile);
      const attempts = Math.max(0, Math.ceil((entry.maxAge - numericAge) * 2));
      return {
        ...entry,
        eligible: eligible && attempts > 0,
        attempts: eligible ? (attempts > 0 ? attempts : 1) : 0,
        reason: eligible ? '' : entry.getReason(currentProfile),
      };
    });
  }, [profile, numericAge]);

  const eligibleResults = results.filter((r) => r.eligible);
  const ineligibleResults = results.filter((r) => !r.eligible);

  const handleDobChange = (e) => {
    const newDob = e.target.value;
    const calcAge = calculateExactAgeFromDOB(newDob);
    setProfile((prev) => ({ ...prev, dob: newDob, age: calcAge.toFixed(1) }));
  };

  const startOver = () => {
    setProfile(INITIAL_PROFILE);
    setStep(3);
    setShowParametersDrawer(true);
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 pb-20 pt-24 md:pt-28 font-sans text-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Top Header & Breadcrumb */}
        <div className="mb-6">
          <nav className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <a href="/" className="hover:text-amber-600 transition-colors">Home</a>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Eligibility Calculator</span>
          </nav>
        </div>

        {/* Main Card Wrapper matching User Screenshot format */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40">
          
          {/* HEADER */}
          <div className="mb-8 border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
                Select Profile Parameters
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">
                Enter accurate details to analyze active entries.
              </p>
            </div>

            {/* Quick Toggle Parameters Drawer Button */}
            <button
              onClick={() => setShowParametersDrawer(!showParametersDrawer)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200 self-start sm:self-auto"
            >
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>{showParametersDrawer ? 'Hide Profile Inputs' : 'Edit Profile Parameters'}</span>
              {showParametersDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* PARAMETERS CONTROL PANEL */}
          {(showParametersDrawer || step !== 3) && (
            <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <User className="w-4 h-4 text-amber-600" />
                  Candidate Profile Controls
                </h3>
                <span className="text-xs text-amber-700 font-bold font-mono">
                  Calculated Age: {numericAge} Years
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* DOB */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={handleDobChange}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                {/* AGE OVERRIDE */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Or Direct Age (Yrs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="32"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    placeholder="e.g. 18.5"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                {/* GENDER */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* STREAM */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    12th Stream
                  </label>
                  <select
                    value={profile.stream}
                    onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  >
                    <option value="PCM">PCM (Phys / Chem / Math)</option>
                    <option value="Non-PCM">Arts / Commerce / Bio / Other</option>
                  </select>
                </div>

                {/* JEE MAIN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    JEE Main Qualified?
                  </label>
                  <select
                    value={profile.hasJEE ? 'Yes' : 'No'}
                    onChange={(e) => setProfile({ ...profile, hasJEE: e.target.value === 'Yes' })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  >
                    <option value="Yes">Yes (Appeared / Rank Holder)</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* GRADUATION STATUS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Graduation Status
                  </label>
                  <select
                    value={profile.degreeStatus}
                    onChange={(e) => setProfile({ ...profile, degreeStatus: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  >
                    <option value="Completed">Completed / Passed</option>
                    <option value="Final Year">Final Year Student</option>
                    <option value="Pursuing">1st/2nd Year Student</option>
                    <option value="None">None (10+2 Level)</option>
                  </select>
                </div>

                {/* DEGREE TYPE */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Degree Type
                  </label>
                  <select
                    value={profile.degreeType}
                    onChange={(e) => setProfile({ ...profile, degreeType: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  >
                    <option value="B.Tech/B.E.">B.Tech / B.E. (Engineering)</option>
                    <option value="LLB">LLB (Law)</option>
                    <option value="Other">B.A. / B.Sc. / B.Com. / Other</option>
                  </select>
                </div>

                {/* NCC 'C' CERTIFICATE */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NCC 'C' Certificate
                  </label>
                  <select
                    value={profile.hasNCC ? 'Yes' : 'No'}
                    onChange={(e) => setProfile({ ...profile, hasNCC: e.target.value === 'Yes' })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  >
                    <option value="Yes">Yes (Hold 'C' Certificate)</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {step !== 3 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <span>Apply Parameters & View Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* SECTION 1: ELIGIBLE ENTRIES */}
          <div className="mb-10">
            <h2 className="text-emerald-700 font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
              <span>Eligible</span>
              <span className="text-emerald-700 font-extrabold">({eligibleResults.length})</span>
            </h2>

            <div className="space-y-3.5">
              {eligibleResults.length === 0 ? (
                <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center">
                  <CircleAlert className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-900 text-sm">No Active Entries Eligible</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Adjust your age, graduation status, or stream parameters above to unlock entries.
                  </p>
                </div>
              ) : (
                eligibleResults.map((entry) => (
                  <div
                    key={entry.name}
                    className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg leading-tight">
                        {entry.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {entry.type}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-mono font-black text-2xl sm:text-3xl text-emerald-700 leading-none">
                        {entry.attempts}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase mt-1 block">
                        ATTEMPTS
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 2: INELIGIBLE ENTRIES */}
          <div className="mb-8">
            <h2 className="text-red-600 font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
              <span>Ineligible</span>
              <span className="text-red-600 font-extrabold">({ineligibleResults.length})</span>
            </h2>

            <div className="space-y-2.5">
              {ineligibleResults.map((entry) => (
                <div
                  key={entry.name}
                  className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 transition-colors"
                >
                  <span className="font-semibold text-sm text-slate-800">
                    {entry.name}
                  </span>
                  <span className="text-xs font-semibold text-red-500 sm:text-right shrink-0">
                    {entry.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM FULL-WIDTH START OVER BUTTON */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={startOver}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Start Over</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}