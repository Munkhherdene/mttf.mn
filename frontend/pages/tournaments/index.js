/**
 * Tournaments Page
 */

import Link from 'next/link';
import api from '@/lib/api';

export default function TournamentsPage({ tournaments }) {
  const upcomingTournaments = tournaments.filter(
    (t) => new Date(t.start_date) > new Date()
  );
  const completedTournaments = tournaments.filter(
    (t) => new Date(t.end_date) < new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
        <p className="text-gray-600 mb-8">Browse all table tennis tournaments</p>

        {/* Upcoming Tournaments */}
        {upcomingTournaments.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Upcoming Tournaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Upcoming
                    </span>
                  </div>

                  {tournament.location && (
                    <p className="text-gray-600 mb-2">📍 {tournament.location}</p>
                  )}

                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {tournament.type}
                    </span>
                  </div>

                  {tournament.description && (
                    <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                      {tournament.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Completed Tournaments */}
        {completedTournaments.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Completed Tournaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedTournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer opacity-75"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Completed
                    </span>
                  </div>

                  {tournament.location && (
                    <p className="text-gray-600 mb-2">📍 {tournament.location}</p>
                  )}

                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {tournament.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {tournaments.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No tournaments available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await api.get('/tournaments', { params: { limit: 100 } });
    return {
      props: {
        tournaments: response.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return {
      props: {
        tournaments: [],
      },
    };
  }
}
