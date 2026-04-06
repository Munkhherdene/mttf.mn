/**
 * Admin Dashboard
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    players: 0,
    tournaments: 0,
    matches: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [playersRes, tournamentsRes, matchesRes] = await Promise.all([
        api.get('/players?limit=1'),
        api.get('/tournaments?limit=1'),
        api.get('/matches?limit=1'),
      ]);

      setStats({
        players: playersRes.data.data?.length || 0,
        tournaments: tournamentsRes.data.data?.length || 0,
        matches: matchesRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="font-bold text-lg">🏓 MTTF Admin</div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage players, tournaments, matches, and content</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.players}</div>
            <div className="text-gray-600">Total Players</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.tournaments}</div>
            <div className="text-gray-600">Tournaments</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.matches}</div>
            <div className="text-gray-600">Matches Recorded</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{user.role}</div>
            <div className="text-gray-600">Your Role</div>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Players Management */}
          <Link href="/admin/players">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2">Players</h3>
              <p className="text-gray-600 text-sm mb-4">
                Add, edit, and manage player profiles
              </p>
              <span className="text-blue-600 font-semibold">Manage →</span>
            </div>
          </Link>

          {/* Tournaments Management */}
          <Link href="/admin/tournaments">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Tournaments</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create and manage tournaments
              </p>
              <span className="text-blue-600 font-semibold">Manage →</span>
            </div>
          </Link>

          {/* Matches Management */}
          <Link href="/admin/matches">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Matches</h3>
              <p className="text-gray-600 text-sm mb-4">
                Record match results and update ratings
              </p>
              <span className="text-blue-600 font-semibold">Manage →</span>
            </div>
          </Link>

          {/* News Management */}
          <Link href="/admin/news">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-3">📰</div>
              <h3 className="text-xl font-bold mb-2">News</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create and publish news articles
              </p>
              <span className="text-blue-600 font-semibold">Manage →</span>
            </div>
          </Link>

          {/* Rankings */}
          <Link href="/rankings">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Rankings</h3>
              <p className="text-gray-600 text-sm mb-4">
                View player rankings and statistics
              </p>
              <span className="text-blue-600 font-semibold">View →</span>
            </div>
          </Link>

          {/* Back to Site */}
          <Link href="/">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-xl font-bold mb-2">Public Site</h3>
              <p className="text-gray-600 text-sm mb-4">
                Return to the public website
              </p>
              <span className="text-blue-600 font-semibold">Visit →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
