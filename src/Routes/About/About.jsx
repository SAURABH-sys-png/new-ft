import React, { useState } from 'react';

export const About = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Simulate network request for production readiness
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setFormStatus('success');
    setFormData({ name: '', email: '', message: '' });

    // Reset success message after 4 seconds
    setTimeout(() => {
      setFormStatus('idle');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold tracking-wide">
            Our Mission
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">DefenceRoger</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
            We built this platform with a simple goal: to give defense aspirants the exact materials, practice, and clarity they need to earn their uniform.
          </p>
        </div>

        {/* Feature/Mission Block */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden mb-20 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Why we started
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Preparing for defense exams shouldn't mean studying in the dark. Too many students waste time trying to figure out <em>what</em> to study rather than actually studying.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  By combining realistic mock exams, previous year questions (PYQs), and detailed SSB narratives, we cut through the noise. We focus on real exam patterns and smart analytics so you can focus on clearing the cutoff.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 border border-slate-100/80 shadow-sm">
                <ul className="space-y-6">
                  {[
                    'Targeted mock exams & real-time analytics',
                    'Extensive library of verified PYQs',
                    'Authentic SSB stories and experiences',
                    'Smart eligibility and career calculators'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-5">

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-12 text-white md:col-span-2 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
                <p className="text-slate-400 leading-relaxed mb-10 text-sm">
                  Got a question about a test series, spotted a bug, or just want to share your progress? Drop us a message and we'll get back to you within 24 hours.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center group">
                    <div className="bg-slate-800 p-3 rounded-lg mr-4 group-hover:bg-indigo-500/20 transition-colors">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Email</p>
                      <a href="mailto:support@defenceroger.com" className="text-slate-200 hover:text-white transition-colors">
                        support@defenceroger.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 md:p-12 md:col-span-3 bg-white/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={formStatus === 'submitting'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all outline-none disabled:opacity-60 placeholder:text-slate-400"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={formStatus === 'submitting'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all outline-none disabled:opacity-60 placeholder:text-slate-400"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'submitting'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all outline-none resize-none disabled:opacity-60 placeholder:text-slate-400"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-medium rounded-xl shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-indigo-600/20 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-900 disabled:hover:shadow-md flex justify-center items-center min-w-[180px]"
                  >
                    {formStatus === 'submitting' ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : formStatus === 'success' ? (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Sent Successfully
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};