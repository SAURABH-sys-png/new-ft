import { useState, useEffect } from 'react';
import { getAdminTests, createTest, deleteTest, getAdminExams, publishTest, unpublishTest } from '../../hooks/api';

export const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', examUuid: '', timeReq: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [testsData, examsData] = await Promise.all([getAdminTests(), getAdminExams()]);
      setTests(testsData);
      setExams(examsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTest({ ...formData, timeReq: Number(formData.timeReq) });
      setShowModal(false);
      setFormData({ title: '', examUuid: '', timeReq: '' });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create test');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      await deleteTest(uuid);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete test');
    }
  };

  const handleTogglePublish = async (uuid, isPublished) => {
    try {
      if (isPublished) {
        await unpublishTest(uuid);
      } else {
        await publishTest(uuid);
      }
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update test status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tests</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Test
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Exam</th>
              <th className="px-6 py-3 font-semibold">Duration (min)</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : tests.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center">No tests found</td></tr>
            ) : (
              tests.map(test => {
                const exam = exams.find(e => e.uuid === test.examUuid);
                return (
                  <tr key={test.uuid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{test.title}</td>
                    <td className="px-6 py-4">{exam?.title || 'Unknown Exam'}</td>
                    <td className="px-6 py-4">{test.timeReq}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(test.uuid, test.isPublished)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          test.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {test.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(test.uuid)} className="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Test</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
                <select
                  required
                  value={formData.examUuid}
                  onChange={e => setFormData({ ...formData, examUuid: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>Select an exam...</option>
                  {exams.map(exam => (
                    <option key={exam.uuid} value={exam.uuid}>{exam.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.timeReq}
                  onChange={e => setFormData({ ...formData, timeReq: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
