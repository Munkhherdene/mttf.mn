/**
 * Rankings Page
 */

import api from '@/lib/api';

export default function RankingsPage({ rankings }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Player Rankings</h1>
        <p className="text-gray-600 mb-8">
          Current rankings based on ELO rating system
        </p>

        {/* Rankings Table */}
        {rankings.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Player</th>
                  <th className="px-6 py-4 text-left font-semibold">Club</th>
                  <th className="px-6 py-4 text-right font-semibold">Rating</th>
                  <th className="px-6 py-4 text-right font-semibold">W/L</th>
                  <th className="px-6 py-4 text-right font-semibold">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((player, index) => (
                  <tr key={player.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-blue-600">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{player.name}</div>
                      <div className="text-sm text-gray-600">{player.nationality}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{player.club || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-2xl font-bold text-blue-600">
                        {player.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900 font-semibold">
                        {player.wins}/{player.losses}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-green-600">
                        {player.win_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No rankings available yet</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">About Rankings</h3>
          <p className="text-blue-800 text-sm">
            Rankings are calculated using the ELO rating system. Each player starts with a base
            rating of 1000. Ratings change based on match results against opponents. The stronger
            your opponent, the more points you gain for a win and the fewer you lose for a loss.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await api.get('/players/rankings', { params: { limit: 100 } });
    return {
      props: {
        rankings: response.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return {
      props: {
        rankings: [],
      },
    };
  }
}
