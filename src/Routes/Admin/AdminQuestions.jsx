import { useState, useEffect } from 'react';
import { getAdminQuestions, createQuestion, deleteQuestion, getAdminTests } from '../../hooks/api';

export const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    testUuid: '',
    questionText: '',
    questionType: 'text',
    section: '',
    sourceQuestionId: '',
    options: ['', '', '', ''],
    answer: '',
    optionNumber: 0,
    marks: 4,
    negativeMarks: 1,
  });

  const fetchData = async () => {
    try {
      const [questionsData, testsData] = await Promise.all([getAdminQuestions(), getAdminTests()]);
      setQuestions(questionsData);
      setTests(testsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.testUuid) return alert('Select a test');
    if (form.options.some(opt => !opt.trim())) return alert('Fill all options');
    if (form.optionNumber < 0 || form.optionNumber >= form.options.length) return alert('Invalid correct option');
    
    setSubmitting(true);
    try {
      await createQuestion({
        testUuid: form.testUuid,
        questionText: form.questionText,
        questionType: form.questionType || 'text',
        section: form.section || undefined,
        sourceQuestionId: form.sourceQuestionId || undefined,
        options: form.options,
        answer: form.options[form.optionNumber],
        optionNumber: Number(form.optionNumber),
        marks: Number(form.marks),
        negativeMarks: Number(form.negativeMarks)
      });
      setShowModal(false);
      setForm({
        testUuid: '',
        questionText: '',
        questionType: 'text',
        section: '',
        sourceQuestionId: '',
        options: ['', '', '', ''],
        answer: '',
        optionNumber: 0,
        marks: 4,
        negativeMarks: 1,
      });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion(uuid);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete question');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Question
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Question</th>
              <th className="px-6 py-3 font-semibold">Test</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : questions.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center">No questions found</td></tr>
            ) : (
              questions.map(q => {
                const test = tests.find(t => t.uuid === q.testUuid);
                return (
                  <tr key={q.uuid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-md">{q.question}</td>
                    <td className="px-6 py-4">{test?.title || 'Unknown Test'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(q.uuid)} className="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 my-8">
            <h2 className="text-xl font-bold mb-4">Add New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Test</label>
                <select
                  required
                  value={form.testUuid}
                  onChange={e => setForm({ ...form, testUuid: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>Select a test...</option>
                  {tests.map(test => (
                    <option key={test.uuid} value={test.uuid}>{test.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea
                  required
                  value={form.questionText}
                  onChange={e => setForm({ ...form, questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section (Optional)</label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={e => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Math"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source ID (Optional)</label>
                  <input
                    type="text"
                    value={form.sourceQuestionId}
                    onChange={e => setForm({ ...form, sourceQuestionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. UPSC-2023-Q1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={form.optionNumber === i}
                      onChange={() => setForm({ ...form, optionNumber: i })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      required
                      type="text"
                      value={opt}
                      onChange={e => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500">Select the radio button next to the correct option.</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                  <input
                    required
                    type="number"
                    value={form.marks}
                    onChange={e => setForm({ ...form, marks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marks</label>
                  <input
                    required
                    type="number"
                    value={form.negativeMarks}
                    onChange={e => setForm({ ...form, negativeMarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
