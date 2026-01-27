import React, { useEffect, useState } from 'react';
import { API_URL } from './config/api';
import type { Approver } from './types/CashRequest';


const ApproverManagement = () => {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', position: '' });

  useEffect(() => {
    fetchApprovers();
  }, []);

  const fetchApprovers = async () => {
    try {
      const response = await fetch(`${API_URL}/approvers`);
      const data = await response.json();
      if (data.success) setApprovers(data.data);
    } catch (error) {
      console.error('Failed to fetch approvers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/approvers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Approver added successfully!');
        setFormData({ name: '', phone: '', position: '' });
        setShowForm(false);
        fetchApprovers();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to add approver');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_URL}/approvers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchApprovers();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to update approver');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this approver?')) return;

    try {
      const response = await fetch(`${API_URL}/approvers/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Approver deleted successfully!');
        fetchApprovers();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to delete approver');
    }
  };

  const activeCount = approvers.filter(a => a.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Approver Management</h1>
          <p className="text-gray-600">Manage authorized approvers ({activeCount}/3 active)</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={activeCount >= 3 && !showForm}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {showForm ? 'Cancel' : '+ Add New Approver'}
          </button>

          {activeCount >= 3 && !showForm && (
            <p className="text-sm text-red-600 mt-2">Maximum 3 active approvers reached. Deactivate one to add more.</p>
          )}

          {showForm && (
            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (Ghana format) *</label>
                <input
                  type="tel"
                  required
                  placeholder="0244123456 or +233244123456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Save Approver
              </button>
            </form>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvers.map((approver) => (
                  <tr key={approver._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{approver.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{approver.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{approver.position}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        approver.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {approver.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toggleActive(approver._id, approver.isActive)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        {approver.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(approver._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ApproverManagement;