/**
 * Admin Matches Management
 * Record match results with set-by-set scoring
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function AdminMatchesPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    tournament_id: '',
    player1_id: '',
    player2_id: '',
    winner_id: '',
    played_at: '',
    sets: [
      { set_number: 1, player1_score: '', player2_score: '' },
      { set_number: 2, player1_score: '', player2_score: '' },
      { set_number: 3, player1_score: '', player2_score: '' },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [tournamentsRes, playersRes, matchesRes] = await Promise.all([
        api.get('/tournaments?limit=100'),
        api.get('/players?limit=100'),
        api.get('/matches?limit=50'),
      ]);

      setTournaments(tournamentsRes.data.data);
      setPlayers(playersRes.data.data);
      setMatches(matchesRes.data.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...formData.sets];
    newSets[index] = {
      ...newSets[index],
      [field]: value === '' ? '' : parseInt(value),
    };
    setFormData({ ...formData, sets: newSets });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.tournament_id || !formData.player1_id || !formData.player2_id || !formData.winner_id) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Validate sets have scores
      const validSets = formData.sets.filter(
        (set) => set.player1_score !== '' && set.player2_score !== ''
      );

      if (validSets.length === 0) {
        setError('Please enter at least one complete set');
        setLoading(false);
        return;
      }

      // Submit
      await api.post('/matches', {
        ...formData,
        tournament_id: parseInt(formData.tournament_id),
        player1_id: parseInt(formData.player1_id),
        player2_id: parseInt(formData.player2_id),
        winner_id: parseInt(formData.winner_id),
        sets: validSets,
      });

      setSuccess('Match recorded successfully! Ratings updated.');
      setFormData({
        tournament_id: '',
        player1_id: '',
        player2_id: '',
        winner_id: '',
        played_at: '',
        sets: [
          { set_number: 1, player1_score: '', player2_score: '' },
          { set_number: 2, player1_score: '', player2_score: '' },
          { set_number: 3, player1_score: '', player2_score: '' },
        ],
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording match');
    } finally {
      setLoading(false);
    }
  };

  const player1Name = players.find((p) => p.id == formData.player1_id)?.name || '';
  const player2Name = players.find((p) => p.id == formData.player2_id)?.name || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Record Match Results</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Enter Match Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4">
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Match Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tournament *</label>
                    <select
                      value={formData.tournament_id}
                      onChange={(e) => setFormData({...formData, tournament_id: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select tournament...</option>
                      {tournaments.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.played_at}
                      onChange={(e) => setFormData({...formData, played_at: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Players */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Players</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Player 1 *</label>
                    <select
                      value={formData.player1_id}
                      onChange={(e) => setFormData({...formData, player1_id: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select player...</option>
                      {players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rating: {p.rating})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Player 2 *</label>
                    <select
                      value={formData.player2_id}
                      onChange={(e) => setFormData({...formData, player2_id: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select player...</option>
                      {players.filter((p) => p.id != formData.player1_id).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rating: {p.rating})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sets */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Set Scores</h3>

                <div className="space-y-4">
                  {formData.sets.map((set, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium mb-2">Set {set.set_number}</label>
                        <div className="text-gray-600 text-sm">{player1Name}</div>
                      </div>
                      <div>
                        <input
                          type="number"
                          value={set.player1_score}
                          onChange={(e) => handleSetChange(index, 'player1_score', e.target.value)}
                          placeholder="Score"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-center"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={set.player2_score}
                          onChange={(e) => handleSetChange(index, 'player2_score', e.target.value)}
                          placeholder="Score"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-center"
                        />
                      </div>
                      <div className="text-gray-600 text-sm">{player2Name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Winner */}
              <div>
                <label className="block text-sm font-medium mb-2">Winner *</label>
                <select
                  value={formData.winner_id}
                  onChange={(e) => setFormData({...formData, winner_id: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select winner...</option>
                  {formData.player1_id && (
                    <option value={formData.player1_id}>{player1Name}</option>
                  )}
                  {formData.player2_id && (
                    <option value={formData.player2_id}>{player2Name}</option>
                  )}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 text-lg"
              >
                {loading ? 'Recording...' : '✨ Record Match & Update Ratings'}
              </button>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="text-blue-800 text-sm font-semibold">ℹ️ Note:</p>
                <p className="text-blue-800 text-sm">
                  When you record this match, both players' ELO ratings will automatically update
                  based on the match result.
                </p>
              </div>
            </form>
          </div>

          {/* Recent Matches */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Recent Matches</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {matches.slice(0, 10).map((match) => (
                <div key={match.id} className="pb-4 border-b last:border-0">
                  <div className="font-semibold text-sm">
                    {match.player1_name} vs {match.player2_name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(match.played_at).toLocaleDateString()}
                  </div>
                  {match.winner_id && (
                    <div className="text-xs text-green-600 font-semibold mt-2">
                      Sets: {match.player1_set_wins}-{match.player2_set_wins}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
