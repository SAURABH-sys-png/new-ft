import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTests, getQuestion, startTest, endTest, updateTestProgress } from '../../hooks/api';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const TestSession = () => {
  const { examUuid, testUuid } = useParams();
  const navigate = useNavigate();

  // State
  const [phase, setPhase] = useState('loading'); // loading | ready | active | submitting | error
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionUuid: selectedOptionIndex }
  const [timeSpent, setTimeSpent] = useState({}); // { questionUuid: seconds }
  const [sessionId, setSessionId] = useState(null);
  const [endingAt, setEndingAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Refs
  const questionTimerRef = useRef(null);
  const autosaveRef = useRef(null);
  const countdownRef = useRef(null);

  // Load test and questions
  useEffect(() => {
    const load = async () => {
      try {
        const allTests = await getTests();
        const foundTest = allTests.find((t) => t.uuid === testUuid);
        if (!foundTest) {
          setError('Test not found.');
          setPhase('error');
          return;
        }
        setTest(foundTest);

        // Fetch all questions in chunks to avoid rate limiting
        const fetchedQuestions = [];
        for (let i = 0; i < foundTest.questions.length; i += 5) {
          const chunk = foundTest.questions.slice(i, i + 5);
          const chunkPromises = chunk.map((qId) => getQuestion(qId));
          const chunkResults = await Promise.all(chunkPromises);
          fetchedQuestions.push(...chunkResults);
        }
        setQuestions(fetchedQuestions);
        setPhase('ready');
      } catch (err) {
        setError(err.message || 'Failed to load test.');
        setPhase('error');
      }
    };
    load();
  }, [testUuid]);

  // Start session
  const handleStart = async () => {
    try {
      setPhase('loading');
      const data = await startTest(testUuid);
      setSessionId(data.sessionId);
      setEndingAt(new Date(data.endingAt));
      setPhase('active');
    } catch (err) {
      if (err.status === 409) {
        setError('You already have an active session for this test.');
      } else if (err.status === 404) {
        console.warn("Backend /start endpoint not found, using mock session.");
        setSessionId("mock-session-" + Date.now());
        const minutes = test?.timeReq || 30;
        setEndingAt(new Date(Date.now() + minutes * 60000));
        setPhase('active');
        return;
      } else {
        setError(err.message || 'Failed to start test.');
      }
      setPhase('error');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== 'active' || !endingAt) return;

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((endingAt - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        handleSubmit(true);
      }
    };

    tick();
    countdownRef.current = setInterval(tick, 1000);
    return () => clearInterval(countdownRef.current);
  }, [phase, endingAt]);

  // Track time spent on current question
  useEffect(() => {
    if (phase !== 'active' || questions.length === 0) return;
    const qUuid = questions[currentIndex]?.uuid;
    if (!qUuid) return;

    questionTimerRef.current = setInterval(() => {
      setTimeSpent((prev) => ({
        ...prev,
        [qUuid]: (prev[qUuid] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(questionTimerRef.current);
  }, [phase, currentIndex, questions]);

  // Autosave every 30s
  const buildUpdatedArr = useCallback(() => {
    return questions
      .filter((q) => answers[q.uuid] !== undefined || (timeSpent[q.uuid] || 0) > 0)
      .map((q) => ({
        questionUuid: q.uuid,
        selectedOption: answers[q.uuid] ?? null,
        correct: false, // Server will compute this
        timeSpentSeconds: timeSpent[q.uuid] || 0,
      }));
  }, [questions, answers, timeSpent]);

  useEffect(() => {
    if (phase !== 'active' || !sessionId) return;

    autosaveRef.current = setInterval(async () => {
      const arr = buildUpdatedArr();
      if (arr.length > 0) {
        try {
          await updateTestProgress(sessionId, arr);
        } catch {
          // Silently fail autosave — don't disrupt the test
        }
      }
    }, 30000);

    return () => clearInterval(autosaveRef.current);
  }, [phase, sessionId, buildUpdatedArr]);

  // Submit
  const handleSubmit = async (auto = false) => {
    if (phase === 'submitting') return;
    setPhase('submitting');

    // Clear all timers
    clearInterval(questionTimerRef.current);
    clearInterval(autosaveRef.current);
    clearInterval(countdownRef.current);

    try {
      // Final progress save
      const arr = buildUpdatedArr();
      if (arr.length > 0) {
        await updateTestProgress(sessionId, arr).catch(e => {
          if (e.status !== 404) throw e;
        });
      }
      await endTest(sessionId).catch(e => {
        if (e.status !== 404) throw e;
      });
      navigate('/test-complete', { state: { auto } });
    } catch (err) {
      // Even if submit fails, navigate — the session may have auto-expired
      navigate('/test-complete', { state: { auto, error: err.message } });
    }
  };

  // Select answer
  const selectOption = (optionIndex) => {
    const qUuid = questions[currentIndex].uuid;
    setAnswers((prev) => {
      // Toggle off if same option clicked again
      if (prev[qUuid] === optionIndex) {
        const next = { ...prev };
        delete next[qUuid];
        return next;
      }
      return { ...prev, [qUuid]: optionIndex };
    });
  };

  // Format time
  const formatTime = (secs) => {
    if (secs == null) return '--:--';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Stats
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  // --- RENDERS ---

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-6 py-4 mt-8">
            {error}
          </div>
          <button
            onClick={() => navigate(`/test-series/${examUuid}`)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to tests
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading test…</p>
        </div>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{test?.title}</h2>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalQuestions} questions
              </span>
              {test?.timeReq && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {test.timeReq} minutes
                </span>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 mb-6 text-left">
              <p className="font-medium mb-1">Before you begin:</p>
              <ul className="list-disc ml-4 space-y-0.5 text-xs">
                <li>The timer starts as soon as you click "Begin Test"</li>
                <li>Your progress is saved automatically every 30 seconds</li>
                <li>You can navigate between questions freely</li>
                <li>The test auto-submits when time runs out</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/test-series/${examUuid}`)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Go back
              </button>
              <button
                onClick={handleStart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Begin Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Submitting your test…</p>
        </div>
      </div>
    );
  }

  // Active phase
  const currentQuestion = questions[currentIndex];
  const isTimeLow = remainingSeconds != null && remainingSeconds <= 300;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Left — title */}
          <h1 className="text-sm font-bold text-gray-900 truncate max-w-[40%]">{test?.title}</h1>

          {/* Center — timer */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-mono font-bold ${isTimeLow ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(remainingSeconds)}
          </div>

          {/* Right — progress + submit */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-500">
              {answeredCount}/{totalQuestions} answered
            </span>
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-lg text-xs transition-colors"
            >
              Submit
            </button>
            {/* Mobile nav toggle */}
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 pt-14">
        {/* Question panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
            {/* Question header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">
                Q{currentIndex + 1}
              </span>
              {currentQuestion.section && (
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {currentQuestion.section}
                </span>
              )}
              {currentQuestion.marks != null && (
                <span className="text-xs text-gray-400 ml-auto">
                  {currentQuestion.marks} marks
                  {currentQuestion.negativeMarks ? ` · −${currentQuestion.negativeMarks}` : ''}
                </span>
              )}
            </div>

            {/* Question text */}
            <div className="text-base md:text-lg text-gray-900 font-medium leading-relaxed mb-8 [&_p]:mb-2 [&_p:last-child]:mb-0">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQuestion.question}
              </ReactMarkdown>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => {
                const isSelected = answers[currentQuestion.uuid] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`text-sm leading-relaxed [&_p]:m-0 ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {option}
                      </ReactMarkdown>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <span className="text-xs text-gray-400">
                {currentIndex + 1} of {totalQuestions}
              </span>

              <button
                onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                disabled={currentIndex === totalQuestions - 1}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — question navigation */}
        <aside
          className={`fixed lg:static inset-0 z-40 lg:z-auto ${
            showMobileNav ? 'flex' : 'hidden lg:flex'
          } flex-col w-full lg:w-64 bg-white border-l border-gray-200 overflow-y-auto`}
        >
          {/* Mobile overlay bg */}
          <div
            className="lg:hidden fixed inset-0 bg-black/30"
            onClick={() => setShowMobileNav(false)}
          />

          <div className="relative z-10 bg-white w-72 lg:w-full ml-auto h-full flex flex-col">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Questions</h3>
              <button
                onClick={() => setShowMobileNav(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Question grid */}
            <div className="p-4 flex-grow overflow-y-auto">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = answers[q.uuid] !== undefined;
                  const isCurrent = i === currentIndex;
                  return (
                    <button
                      key={q.uuid}
                      onClick={() => {
                        setCurrentIndex(i);
                        setShowMobileNav(false);
                      }}
                      className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : isAnswered
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar footer — legend */}
            <div className="px-4 py-3 border-t border-gray-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Current
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded bg-green-50 border border-green-200 inline-block" /> Answered
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded bg-gray-50 border border-gray-200 inline-block" /> Not answered
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit confirmation modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirmSubmit(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Submit test?</h3>
            <p className="text-sm text-gray-500 mb-4">
              You've answered {answeredCount} of {totalQuestions} questions.
              {totalQuestions - answeredCount > 0 && (
                <> {totalQuestions - answeredCount} question{totalQuestions - answeredCount > 1 ? 's' : ''} will be left unanswered.</>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Continue test
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmit(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
