import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestSession, saveAnswer, submitTestSession } from '../../hooks/api';
import 'katex/dist/katex.min.css';
import katex from 'katex';

/* ---------- KaTeX Rendering Helper ---------- */
/**
 * Converts plain-text segments (between math delimiters) into React elements,
 * splitting on newlines so they render as <br/> tags.
 */
const renderPlainSegment = (str, keyPrefix) => {
  if (!str) return null;
  const lines = str.split('\n');
  const out = [];
  lines.forEach((line, i) => {
    if (i > 0) out.push(<br key={`${keyPrefix}-br-${i}`} />);
    if (line) out.push(<span key={`${keyPrefix}-t-${i}`}>{line}</span>);
  });
  return out;
};

const renderMathInText = (text) => {
  if (!text || typeof text !== 'string') return text || '';

  const parts = [];
  let key = 0;

  // Order matters: match $$ before $, and \[ before \(
  // Allow multi-line content inside all delimiters (including single $)
  const regex = /(\$\$[\s\S]*?\$\$|\$(?:[^$\\]|\\.)+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Plain text before this math token
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      parts.push(...(renderPlainSegment(plain, `p${key++}`) || []));
    }

    const raw = match[0];
    let latex = '';
    let displayMode = false;

    if (raw.startsWith('$$')) {
      latex = raw.slice(2, -2);
      displayMode = true;
    } else if (raw.startsWith('$')) {
      latex = raw.slice(1, -1);
    } else if (raw.startsWith('\\[')) {
      latex = raw.slice(2, -2);
      displayMode = true;
    } else if (raw.startsWith('\\(')) {
      latex = raw.slice(2, -2);
    }

    try {
      const html = katex.renderToString(latex.trim(), {
        throwOnError: false,
        displayMode,
        // Trust HTML-like commands such as \url, \href
        trust: true,
        // Strict mode off so minor LaTeX quirks don't throw
        strict: false,
      });

      if (displayMode) {
        // Display math → block-level centered element
        parts.push(
          <div
            key={key++}
            className="katex-display-wrapper"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        // Inline math → inline element
        parts.push(
          <span
            key={key++}
            className="katex-inline-wrapper"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
    } catch {
      parts.push(
        <code key={key++} className="text-red-500 text-xs font-mono bg-red-50 px-1 rounded">
          {raw}
        </code>
      );
    }

    lastIndex = match.index + raw.length;
  }

  // Remaining plain text after last math token
  if (lastIndex < text.length) {
    const plain = text.slice(lastIndex);
    parts.push(...(renderPlainSegment(plain, `p${key++}`) || []));
  }

  return parts.length > 0 ? parts : text;
};

/* ---------- Component ---------- */
export const TestSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const questionTimerRef = useRef(0); // seconds spent on current question
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getTestSession(sessionId);
        setSession(data);

        // If session is not in-progress, redirect to results
        if (data.status !== 'in-progress') {
          navigate(`/test-complete/${sessionId}`, { replace: true });
          return;
        }

        // Pre-fill existing answers
        const existingAnswers = {};
        if (data.answers) {
          data.answers.forEach((a) => {
            existingAnswers[a.questionId] = a.selectedOption;
          });
        }
        setAnswers(existingAnswers);

        // Calculate time left
        const expiresAt = new Date(data.expiresAt).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeLeft(remaining);
      } catch (err) {
        setError(err.message || 'Failed to load test session');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          // Auto-submit on expiry
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [timeLeft !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-question timer
  useEffect(() => {
    questionTimerRef.current = 0;
    intervalRef.current = setInterval(() => {
      questionTimerRef.current += 1;
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [currentQ]);

  const questions = session?.questions || [];
  const currentQuestion = questions[currentQ];

  // Select an option
  const handleSelectOption = async (optionIndex) => {
    if (!currentQuestion) return;

    const qId = currentQuestion.questionId;
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));

    // Save answer to backend
    setSaving(true);
    try {
      await saveAnswer(sessionId, {
        questionId: qId,
        selectedOption: optionIndex,
        timeSpentSeconds: questionTimerRef.current,
      });
    } catch (err) {
      console.error('Failed to save answer:', err);
    } finally {
      setSaving(false);
    }
  };

  // Navigate questions
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQ(index);
    }
  };

  // Submit
  const handleSubmit = useCallback(async (isAutoExpiry = false) => {
    setSubmitting(true);
    setShowConfirmSubmit(false);
    try {
      await submitTestSession(sessionId);
      navigate(`/test-complete/${sessionId}`, { replace: true });
    } catch (err) {
      if (isAutoExpiry) {
        // If expired, still navigate
        navigate(`/test-complete/${sessionId}`, { replace: true });
      } else {
        setError(err.message || 'Failed to submit test');
        setSubmitting(false);
      }
    }
  }, [sessionId, navigate]);

  // Format time
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeft !== null && timeLeft <= 60;

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading test…</p>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-700 text-sm max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  /* ---------- Main Test UI ---------- */
  return (
    <div className="min-h-screen pt-20 pb-6 px-4 flex flex-col">
      {/* Top bar: Timer & Progress */}
      <div className="max-w-5xl w-full mx-auto mb-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Timer */}
          <div className={`flex items-center gap-2 text-sm font-mono font-bold ${isTimeCritical ? 'text-red-600' : 'text-gray-900'}`}>
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(timeLeft)}</span>
            {isTimeCritical && <span className="text-xs font-normal text-red-500">Time is running out!</span>}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{answeredCount} / {questions.length} answered</span>
            {saving && (
              <span className="flex items-center gap-1 text-blue-500 text-xs">
                <div className="w-2.5 h-2.5 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                saving
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {submitting ? 'Submitting…' : 'Submit Test'}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="max-w-5xl w-full mx-auto flex-1 flex gap-4">
        {/* Question panel */}
        <div className="flex-1 min-w-0">
          {currentQuestion && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {/* Question number */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center">
                  {currentQ + 1}
                </span>
                <span className="text-gray-400 text-xs">of {questions.length}</span>
              </div>

              {/* Question text with KaTeX */}
              <div className="question-math-content text-gray-900 text-base leading-relaxed mb-6">
                {renderMathInText(currentQuestion.question)}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.questionId] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-gray-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600 text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="option-math-content flex-1 min-w-0">
                        {renderMathInText(option)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => goToQuestion(currentQ - 1)}
                  disabled={currentQ === 0}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => goToQuestion(currentQ + 1)}
                  disabled={currentQ === questions.length - 1}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Question navigation sidebar */}
        <div className="hidden md:block w-56 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sticky top-24">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.questionId] !== undefined;
                const isCurrent = idx === currentQ;
                return (
                  <button
                    key={q.questionId}
                    onClick={() => goToQuestion(idx)}
                    className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-150 ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : isAnswered
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-green-50 border border-green-200" />
                Answered ({answeredCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gray-50 border border-gray-200" />
                Unanswered ({questions.length - answeredCount})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile question nav */}
      <div className="md:hidden max-w-5xl w-full mx-auto mt-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3">
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.questionId] !== undefined;
              const isCurrent = idx === currentQ;
              return (
                <button
                  key={q.questionId}
                  onClick={() => goToQuestion(idx)}
                  className={`shrink-0 w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-50 text-gray-400 border border-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm submit modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Submit Test?</h2>
            <p className="text-gray-500 text-sm mb-1">
              You have answered <span className="text-gray-900 font-semibold">{answeredCount}</span> out of <span className="text-gray-900 font-semibold">{questions.length}</span> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-amber-600 text-xs mb-4">
                ⚠ You have {questions.length - answeredCount} unanswered question{questions.length - answeredCount !== 1 ? 's' : ''}.
              </p>
            )}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg text-sm transition-colors"
              >
                {submitting ? 'Submitting…' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
