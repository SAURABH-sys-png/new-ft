import { useState, useEffect } from 'react';
import { getAdminExams, createExam, deleteExam } from '../../hooks/api';

export const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchExams = async () => {
    try {
      const data = await getAdminExams();
      setExams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createExam(formData);
      setShowModal(false);
      setFormData({ title: '', description: '' });
      fetchExams();
    } catch (err) {
      alert(err.message || 'Failed to create exam');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await deleteExam(uuid);
      fetchExams();
    } catch (err) {
      alert(err.message || 'Failed to delete exam');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Exams</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Exam
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Description</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center">No exams found</td></tr>
            ) : (
              exams.map(exam => (
                <tr key={exam.uuid} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{exam.title}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{exam.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(exam.uuid)} className="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Exam</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
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
