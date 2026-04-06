/**
 * Admin Tournaments Management
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function AdminTournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    location: '',
    type: 'National',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTournaments();
  }, [router]);

  const fetchTournaments = async () => {
    try {
      const response = await api.get('/tournaments?limit=100');
      setTournaments(response.data.data);
    } catch (err) {
      setError('Failed to fetch tournaments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.patch(`/tournaments/${editingId}`, formData);
      } else {
        await api.post('/tournaments', formData);
      }

      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        location: '',
        type: 'National',
        description: '',
      });
      setEditingId(null);
      fetchTournaments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tournament) => {
    setFormData({
      name: tournament.name,
      start_date: tournament.start_date.split('T')[0],
      end_date: tournament.end_date.split('T')[0],
      location: tournament.location || '',
      type: tournament.type,
      description: tournament.description || '',
    });
    setEditingId(tournament.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      try {
        await api.delete(`/tournaments/${id}`);
        fetchTournaments();
      } catch (err) {
        setError('Failed to delete tournament');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Tournaments</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? 'Edit Tournament' : 'Add Tournament'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="National">National</option>
                  <option value="International">International</option>
                  <option value="Club">Club</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Tournament' : 'Add Tournament'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: '',
                      start_date: '',
                      end_date: '',
                      location: '',
                      type: 'National',
                      description: '',
                    });
                  }}
                  className="w-full bg-gray-300 text-gray-900 py-2 rounded-md font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Tournaments List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Tournaments ({tournaments.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Dates</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((tournament) => (
                    <tr key={tournament.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{tournament.name}</td>
                      <td className="px-6 py-4 text-gray-600">{tournament.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                        {new Date(tournament.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(tournament)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tournament.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
