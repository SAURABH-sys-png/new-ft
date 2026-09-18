import { useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, CircleAlert, RotateCcw, ShieldCheck } from 'lucide-react';

const INITIAL_PROFILE = {
  age: '',
  gender: 'Male',
  stream: 'Other',
  hasJEE: false,
  degreeStatus: 'None',
  degreeType: 'Other',
  hasNCC: false,
};

const entries = [
  { name: 'NDA Army Wing', group: 'NDA', type: '10+2', minAge: 15.5, maxAge: 18.5, condition: (p) => p.age >= 15.5 && p.age <= 18.5 },
  { name: 'NDA Navy & Air Force', group: 'NDA', type: '10+2', minAge: 15.5, maxAge: 19.5, condition: (p) => p.age >= 15.5 && p.age <= 19.5 && p.stream === 'PCM' },
  { name: 'TES Army', group: 'Technical', type: '10+2', minAge: 16.5, maxAge: 19.5, condition: (p) => p.age >= 16.5 && p.age <= 19.5 && p.stream === 'PCM' && p.hasJEE && p.gender === 'Male' },
  { name: '10+2 B.Tech Cadet Entry', group: 'Technical', type: '10+2', minAge: 16.5, maxAge: 19.5, condition: (p) => p.age >= 16.5 && p.age <= 19.5 && p.stream === 'PCM' && p.hasJEE && p.gender === 'Male' },
  { name: 'CDS IMA', group: 'CDS', type: 'Graduate', minAge: 19, maxAge: 24, condition: (p) => p.age >= 19 && p.age <= 24 && p.degreeStatus === 'Completed' && p.gender === 'Male' },
  { name: 'CDS INA', group: 'CDS', type: 'Graduate', minAge: 19, maxAge: 24, condition: (p) => p.age >= 19 && p.age <= 24 && p.degreeType === 'B.Tech/B.E.' && p.gender === 'Male' },
  { name: 'CDS AFA', group: 'CDS', type: 'Graduate', minAge: 20, maxAge: 24, condition: (p) => p.age >= 20 && p.age <= 24 && (p.degreeType === 'B.Tech/B.E.' || (p.degreeStatus === 'Completed' && p.stream === 'PCM')) && p.gender === 'Male' },
  { name: 'CDS OTA', group: 'CDS', type: 'Graduate', minAge: 19, maxAge: 25, condition: (p) => p.age >= 19 && p.age <= 25 && p.degreeStatus === 'Completed' },
  { name: 'AFCAT Flying Branch', group: 'AFCAT', type: 'Graduate', minAge: 20, maxAge: 24, condition: (p) => p.age >= 20 && p.age <= 24 && p.stream === 'PCM' && p.degreeStatus === 'Completed' },
  { name: 'AFCAT Ground Duty (Technical)', group: 'AFCAT', type: 'Graduate', minAge: 20, maxAge: 26, condition: (p) => p.age >= 20 && p.age <= 26 && p.stream === 'PCM' && p.degreeType === 'B.Tech/B.E.' },
  { name: 'AFCAT Ground Duty (Non-Technical)', group: 'AFCAT', type: 'Graduate', minAge: 20, maxAge: 26, condition: (p) => p.age >= 20 && p.age <= 26 && p.degreeStatus === 'Completed' },
  { name: 'TGC Army', group: 'Technical', type: 'Graduate', minAge: 20, maxAge: 27, condition: (p) => p.age >= 20 && p.age <= 27 && p.degreeType === 'B.Tech/B.E.' && p.gender === 'Male' },
  { name: 'SSC Tech Army', group: 'Technical', type: 'Graduate', minAge: 20, maxAge: 27, condition: (p) => p.age >= 20 && p.age <= 27 && p.degreeType === 'B.Tech/B.E.' },
  { name: 'NCC Special Entry', group: 'Special Entry', type: 'Graduate', minAge: 19, maxAge: 25, condition: (p) => p.age >= 19 && p.age <= 25 && p.degreeStatus === 'Completed' && p.hasNCC },
  { name: 'JAG', group: 'Special Entry', type: 'Graduate', minAge: 21, maxAge: 27, condition: (p) => p.age >= 21 && p.age <= 27 && p.degreeType === 'LLB' },
];

const fieldClass =
  'mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50';

const labelClass = 'text-sm font-medium text-slate-700';

function getReason(entry, profile) {
  if (profile.age < entry.minAge) return `Available from age ${entry.minAge} years.`;
  if (profile.age > entry.maxAge) return `Upper age limit is ${entry.maxAge} years.`;
  if (
    entry.name.includes('NDA Navy') ||
    entry.name === 'AFCAT Flying Branch' ||
    entry.name === 'AFCAT Ground Duty (Technical)' ||
    entry.name === 'TES Army' ||
    entry.name === '10+2 B.Tech Cadet Entry'
  ) {
    if (profile.stream !== 'PCM') return 'Requires PCM in 10+2.';
  }
  if ((entry.name === 'TES Army' || entry.name === '10+2 B.Tech Cadet Entry') && !profile.hasJEE) return 'Requires JEE Main qualification.';
  if (entry.type === 'Graduate' && profile.degreeStatus !== 'Completed') return 'Requires graduation or final-year status.';
  if (entry.name.includes('B.Tech') || entry.name.includes('Technical') || entry.name === 'CDS INA') return 'Requires an eligible technical degree.';
  if (entry.name === 'JAG') return 'Requires an LLB degree.';
  if (entry.name === 'NCC Special Entry' && !profile.hasNCC) return "Requires an NCC 'C' certificate.";
  if (entry.name === 'NDA Army Wing' && profile.age > 18.5) return 'Upper age limit is 18.5 years.';
  if (entry.group === 'NDA' && profile.stream !== 'PCM') return 'This entry requires PCM in 10+2.';
  return profile.gender === 'Female' && ['CDS IMA', 'CDS INA', 'CDS AFA'].includes(entry.name)
    ? 'This calculator marks this entry for male candidates.'
    : 'One or more criteria are not met.';
}

function calculateResults(profile) {
  return entries.map((entry) => {
    const eligible = entry.condition(profile);
    const attempts = Math.max(0, Math.ceil((entry.maxAge - profile.age) * 2));
    return { ...entry, eligible: eligible && attempts > 0, attempts, reason: eligible ? '' : getReason(entry, profile) };
  });
}

const HERO_IMAGE = '/images/para-sf-marching.jpg';

export default function DefenseCalculator() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  const updateProfile = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const continueToQualifications = () => {
    const age = Number(profile.age);
    if (!profile.age || Number.isNaN(age) || age < 15.5 || age > 32) {
      setError('Enter an age between 15.5 and 32 years.');
      return;
    }
    setError('');
    setStep(2);
  };

  const showResults = () => {
    const normalizedProfile = { ...profile, age: Number(profile.age) };
    setResults(calculateResults(normalizedProfile));
    setStep(3);
  };

  const startOver = () => {
    setProfile(INITIAL_PROFILE);
    setResults([]);
    setError('');
    setStep(1);
  };

  const eligibleResults = results.filter((entry) => entry.eligible);
  const ineligibleResults = results.filter((entry) => !entry.eligible);

  return (
    <main className="min-h-screen w-full bg-slate-50 pb-16 pt-24 md:pt-28 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <a href="/" className="hover:text-slate-900">Home</a>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">Eligibility calculator</span>
        </nav>

        {/* Two-column hero + calculator */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          {/* LEFT: Compact motivating hero */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-40 w-full bg-gradient-to-br from-blue-100 to-blue-200 sm:h-48 lg:h-64">
                <img
                  src={HERO_IMAGE}
                  alt="Armed Forces personnel saluting"
                  loading="eager"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  <ShieldCheck size={13} />
                  Career readiness tool
                </div>
                <h1 className="text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
                  Find the defence entry that fits your profile.
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Compare active entries across NDA, CDS, AFCAT and technical routes using your age and academic background.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">15+</div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">Entries</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">3</div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">Services</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">~30s</div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">To check</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 px-1 text-xs leading-5 text-slate-500">
              <CircleAlert size={13} className="mt-0.5 shrink-0" />
              For guidance only. Verify the latest official notification before applying.
            </p>
          </aside>

          {/* RIGHT: Calculator card */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {/* Stepper */}
            <div className="mb-6 flex items-center">
              {[
                ['Profile', 1],
                ['Qualifications', 2],
                ['Your matches', 3],
              ].map(([label, number], index) => {
                const active = step >= number;
                const done = step > number;
                return (
                  <div key={label} className="flex flex-1 items-center last:flex-none">
                    <div className={`flex items-center gap-2 text-sm ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium ${done
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : active
                              ? 'border-blue-600 bg-white text-blue-600'
                              : 'border-slate-300 bg-white text-slate-400'
                          }`}
                      >
                        {done ? <Check size={14} strokeWidth={3} /> : number}
                      </span>
                      <span className="hidden font-medium sm:inline">{label}</span>
                    </div>
                    {index < 2 && <div className={`mx-3 h-px flex-1 ${step > number ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                  </div>
                );
              })}
            </div>

            {step < 3 && (
              <header className="mb-5 border-b border-slate-100 pb-4">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Step {step} of 2</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
                  {step === 1 ? 'Tell us about yourself' : 'Add your qualifications'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {step === 1
                    ? 'We use these details to filter the right opportunities.'
                    : 'These details help us make your matches more useful.'}
                </p>
              </header>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="age" className={labelClass}>
                    Current age <span className="font-normal text-slate-400">(in years)</span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="15.5"
                    max="32"
                    step="0.1"
                    value={profile.age}
                    onChange={updateProfile}
                    placeholder="e.g. 18.5"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className={labelClass}>Gender</label>
                  <select id="gender" name="gender" value={profile.gender} onChange={updateProfile} className={fieldClass}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {error && (
                  <p role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    <CircleAlert size={15} />
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={continueToQualifications}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                  <span>
                    Age: <strong className="text-slate-900">{profile.age} yrs</strong>
                  </span>
                  <span className="font-medium text-slate-900">{profile.gender}</span>
                </div>

                <div>
                  <label htmlFor="stream" className={labelClass}>12th stream</label>
                  <select id="stream" name="stream" value={profile.stream} onChange={updateProfile} className={fieldClass}>
                    <option value="Other">Arts, Commerce, Biology or other</option>
                    <option value="PCM">Physics, Chemistry &amp; Mathematics (PCM)</option>
                  </select>
                </div>

                {profile.stream === 'PCM' && Number(profile.age) <= 20 && (
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      name="hasJEE"
                      checked={profile.hasJEE}
                      onChange={updateProfile}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    I have appeared for JEE Main
                  </label>
                )}

                {Number(profile.age) >= 19 && (
                  <div className="space-y-5 border-t border-slate-100 pt-5">
                    <div>
                      <label htmlFor="degreeStatus" className={labelClass}>Graduation status</label>
                      <select id="degreeStatus" name="degreeStatus" value={profile.degreeStatus} onChange={updateProfile} className={fieldClass}>
                        <option value="None">Not started or in progress</option>
                        <option value="Completed">Final year or completed</option>
                      </select>
                    </div>

                    {profile.degreeStatus === 'Completed' && (
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="degreeType" className={labelClass}>Degree type</label>
                          <select id="degreeType" name="degreeType" value={profile.degreeType} onChange={updateProfile} className={fieldClass}>
                            <option value="Other">B.A., B.Sc., B.Com. or other</option>
                            <option value="B.Tech/B.E.">B.Tech. / B.E.</option>
                            <option value="LLB">LLB</option>
                          </select>
                        </div>

                        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            name="hasNCC"
                            checked={profile.hasNCC}
                            onChange={updateProfile}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          I hold an NCC &lsquo;C&rsquo; certificate
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={showResults}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    See my matches <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Your results</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
                      {eligibleResults.length} active {eligibleResults.length === 1 ? 'match' : 'matches'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Based on the profile you entered. Attempts are indicative.
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-lg font-semibold text-blue-700">
                    {eligibleResults.length}
                  </div>
                </div>

                {/* Eligible */}
                <div className="space-y-3">
                  {eligibleResults.length === 0 ? (
                    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                      <CircleAlert className="mx-auto mb-2 text-slate-400" size={22} />
                      <p className="font-medium text-slate-900">No active matches found</p>
                      <p className="mt-1 text-sm text-slate-600">Try another profile or verify the latest notification criteria.</p>
                    </div>
                  ) : (
                    eligibleResults.map((entry) => (
                      <article
                        key={entry.name}
                        className="flex flex-col justify-between gap-3 rounded-md border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <BadgeCheck size={17} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">{entry.name}</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {entry.group} <span className="mx-1 text-slate-300">•</span> {entry.type} entry
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-left sm:text-right">
                          <strong className="block text-base font-semibold text-slate-900">{entry.attempts}</strong>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">indicative attempts</span>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* Ineligible */}
                {ineligibleResults.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <BookOpen size={14} className="text-slate-400" />
                      Other entries
                    </h3>
                    <div className="divide-y divide-slate-100 overflow-hidden rounded-md border border-slate-200 bg-white">
                      {ineligibleResults.map((entry) => (
                        <div key={entry.name} className="flex flex-col gap-1.5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-medium text-slate-800">{entry.name}</span>
                          <span className="text-xs text-slate-500">{entry.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={startOver}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw size={15} />
                  Recalculate
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}