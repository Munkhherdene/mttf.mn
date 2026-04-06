/**
 * Player Detail Page
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function PlayerDetailPage({ player, matches, tournamentStats }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!player) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Player not found</p>
        <Link href="/players" className="text-blue-600 hover:text-blue-800">
          Back to Players
        </Link>
      </div>
    );
  }

  const winRate =
    player.total_matches > 0
      ? ((player.wins / player.total_matches) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/players" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Players
        </Link>

        {/* Player Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Player Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{player.name}</h1>
              {player.club && <p className="text-gray-600 mb-2">Club: {player.club}</p>}
              {player.age && <p className="text-gray-600 mb-4">Age: {player.age}</p>}
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {player.nationality || 'Mongolia'}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">{player.rating}</div>
              <div className="text-gray-600">Current Rating</div>
              <div className="text-sm text-gray-500 mt-2">
                Peak: {player.peak_rating}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{player.wins}</div>
                <div className="text-gray-600 text-sm">Wins</div>
              </div>
              <div className="text-center bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{player.losses}</div>
                <div className="text-gray-600 text-sm">Losses</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{winRate}%</div>
                <div className="text-gray-600 text-sm">Win Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        {matches.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
            <div className="space-y-4">
              {matches.slice(0, 5).map((match) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div>
                    <p className="font-semibold">
                      vs {match.opponent_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {match.tournament_name} • {new Date(match.played_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {match.won ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Win
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Loss
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tournament Performance */}
        {tournamentStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Tournament Performance</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tournament</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Matches</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Wins</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Losses</th>
                </tr>
              </thead>
              <tbody>
                {tournamentStats.map((stat) => (
                  <tr key={stat.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{stat.name}</td>
                    <td className="px-6 py-4">{stat.total_matches}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{stat.wins}</td>
                    <td className="px-6 py-4 text-red-600 font-semibold">{stat.losses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const [playerRes, matchesRes, statsRes] = await Promise.all([
      api.get(`/players/${params.id}`),
      api.get(`/players/${params.id}/matches`),
      api.get(`/players/${params.id}/tournament-stats`),
    ]);

    return {
      props: {
        player: playerRes.data.data,
        matches: matchesRes.data.data || [],
        tournamentStats: statsRes.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching player detail:', error);
    return {
      notFound: true,
    };
  }
}
