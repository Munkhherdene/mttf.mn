/**
 * Home Page
 * Landing page with featured content
 */

import Link from 'next/link';
import api from '@/lib/api';
import PlayerCard from '@/components/PlayerCard';

export default function Home({ topPlayers, recentMatches, latestNews }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">🏓 Mongolian Table Tennis Federation</h1>
          <p className="text-xl mb-8 opacity-90">
            Promoting Excellence in Table Tennis • Rankings • Tournaments • Players
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/players" className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition">
              Browse Players
            </Link>
            <Link href="/rankings" className="bg-blue-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
              View Rankings
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Players */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Players</h2>
            <Link href="/rankings" className="text-blue-600 hover:text-blue-800 font-semibold">
              View All →
            </Link>
          </div>

          {topPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No players available yet.</p>
          )}
        </section>

        {/* Latest News */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Link href="/news" className="text-blue-600 hover:text-blue-800 font-semibold">
              View All →
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestNews.slice(0, 2).map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    By {article.author_name} • {new Date(article.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 line-clamp-3">{article.content}</p>
                  <Link href={`/news/${article.id}`} className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No news available yet.</p>
          )}
        </section>

        {/* Statistics */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{topPlayers.length}</div>
              <div className="text-gray-600">Active Players</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Tournaments</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Matches Recorded</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">#1</div>
              <div className="text-gray-600">Official Database</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const [playersRes, newsRes] = await Promise.all([
      api.get('/players/rankings', { params: { limit: 4 } }),
      api.get('/news', { params: { limit: 5 } }),
    ]);

    return {
      props: {
        topPlayers: playersRes.data.data || [],
        latestNews: newsRes.data.data || [],
        recentMatches: [],
      },
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      props: {
        topPlayers: [],
        latestNews: [],
        recentMatches: [],
      },
    };
  }
}
