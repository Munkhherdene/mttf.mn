/**
 * Admin News Management
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function AdminNewsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
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
    fetchArticles();
  }, [router]);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/news/admin/all?limit=50');
      setArticles(response.data.data);
    } catch (err) {
      setError('Failed to fetch articles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.patch(`/news/${editingId}`, formData);
      } else {
        await api.post('/news', formData);
      }

      setFormData({ title: '', content: '', published: false });
      setEditingId(null);
      fetchArticles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      content: article.content,
      published: article.published,
    });
    setEditingId(article.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/news/${id}`);
        fetchArticles();
      } catch (err) {
        setError('Failed to delete article');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage News</h1>
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
              {editingId ? 'Edit Article' : 'Create Article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Article content..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="w-5 h-5 border border-gray-300 rounded"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', content: '', published: false });
                  }}
                  className="w-full bg-gray-300 text-gray-900 py-2 rounded-md font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Articles ({articles.length})</h2>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {articles.length > 0 ? (
                <div className="divide-y">
                  {articles.map((article) => (
                    <div key={article.id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{article.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            By {article.author_name} • {new Date(article.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          article.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2 mb-3">{article.content}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-600">
                  No articles yet. Create your first one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
