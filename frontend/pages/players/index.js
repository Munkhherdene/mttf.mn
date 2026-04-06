/**
 * Players Page
 */

import { useState } from 'react';
import api from '@/lib/api';
import PlayerCard from '@/components/PlayerCard';

export default function PlayersPage({ initialPlayers }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [sortBy, setSortBy] = useState('rating');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Players</h1>
        <p className="text-gray-600 mb-8">Browse all registered players and their statistics</p>

        {/* Sort Options */}
        <div className="mb-8 flex gap-4">
          <label className="flex items-center gap-2">
            <span className="text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Rating (High to Low)</option>
              <option value="name">Name (A to Z)</option>
            </select>
          </label>
        </div>

        {/* Players Grid */}
        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No players found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await api.get('/players', { params: { limit: 100 } });
    return {
      props: {
        initialPlayers: response.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      props: {
        initialPlayers: [],
      },
    };
  }
}
