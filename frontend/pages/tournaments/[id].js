/**
 * Tournament Detail Page
 */

import Link from 'next/link';
import api from '@/lib/api';

export default function TournamentDetailPage({ tournament }) {
  if (!tournament) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Tournament not found</p>
        <Link href="/tournaments" className="text-blue-600 hover:text-blue-800">
          Back to Tournaments
        </Link>
      </div>
    );
  }

  const startDate = new Date(tournament.start_date);
  const endDate = new Date(tournament.end_date);
  const isUpcoming = startDate > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/tournaments" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Tournaments
        </Link>

        {/* Tournament Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{tournament.name}</h1>
              <div className="flex gap-4 items-center flex-wrap">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {tournament.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isUpcoming
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tournament.location && (
              <div>
                <h3 className="text-gray-600 text-sm font-semibold mb-2">LOCATION</h3>
                <p className="text-xl font-semibold text-gray-900">{tournament.location}</p>
              </div>
            )}

            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">START DATE</h3>
              <p className="text-xl font-semibold text-gray-900">
                {startDate.toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">END DATE</h3>
              <p className="text-xl font-semibold text-gray-900">
                {endDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          {tournament.description && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-700">{tournament.description}</p>
            </div>
          )}
        </div>

        {/* Matches */}
        {tournament.matches && tournament.matches.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Matches</h2>
            <div className="space-y-4">
              {tournament.matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-semibold">
                      {match.player1_name} vs {match.player2_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(match.played_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    {match.winner_id ? (
                      <div>
                        <div className="font-semibold text-gray-900">
                          {match.player1_set_wins} - {match.player2_set_wins}
                        </div>
                        <div className="text-sm text-gray-600">
                          Winner: {match.winner_name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const response = await api.get(`/tournaments/${params.id}`);
    return {
      props: {
        tournament: response.data.data,
      },
    };
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return {
      notFound: true,
    };
  }
}
