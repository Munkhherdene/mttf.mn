/**
 * Player Card Component
 */

import Link from 'next/link';

export default function PlayerCard({ player }) {
  const winRate = player.total_matches > 0 
    ? ((player.wins / player.total_matches) * 100).toFixed(1)
    : 0;

  return (
    <Link href={`/players/${player.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">{player.name}</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            #{player.rank || '-'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Rating:</span>
            <span className="text-xl font-bold text-blue-600">{player.rating}</span>
          </div>

          {player.club && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Club:</span>
              <span className="text-sm text-gray-900">{player.club}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Win Rate:</span>
            <span className="text-sm font-semibold text-green-600">{winRate}%</span>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <div className="flex-1">
              <div className="text-sm text-gray-600">Wins</div>
              <div className="text-lg font-bold text-gray-900">{player.wins}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Losses</div>
              <div className="text-lg font-bold text-gray-900">{player.losses}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-bold text-gray-900">{player.total_matches}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
