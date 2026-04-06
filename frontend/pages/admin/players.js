/**
 * Admin Players Management
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function AdminPlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    club: '',
    nationality: 'Mongolia',
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
    fetchPlayers();
  }, [router]);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players?limit=100');
      setPlayers(response.data.data);
    } catch (err) {
      setError('Failed to fetch players');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        // Update
        await api.patch(`/players/${editingId}`, formData);
      } else {
        // Create
        await api.post('/players', formData);
      }

      // Reset form and refresh list
      setFormData({ name: '', age: '', club: '', nationality: 'Mongolia' });
      setEditingId(null);
      fetchPlayers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving player');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player) => {
    setFormData({
      name: player.name,
      age: player.age || '',
      club: player.club || '',
      nationality: player.nationality || 'Mongolia',
    });
    setEditingId(player.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/players/${id}`);
        fetchPlayers();
      } catch (err) {
        setError('Failed to delete player');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Players</h1>
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
              {editingId ? 'Edit Player' : 'Add New Player'}
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
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Club</label>
                <input
                  type="text"
                  value={formData.club}
                  onChange={(e) => setFormData({...formData, club: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Player' : 'Add Player'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({name: '', age: '', club: '', nationality: 'Mongolia'});
                  }}
                  className="w-full bg-gray-300 text-gray-900 py-2 rounded-md font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Players List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Players ({players.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Club</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{player.name}</td>
                      <td className="px-6 py-4 text-gray-600">{player.club || '-'}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">{player.rating}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
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
