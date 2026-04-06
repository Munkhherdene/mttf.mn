/**
 * News Page
 */

import Link from 'next/link';
import api from '@/lib/api';

export default function NewsPage({ articles }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">News</h1>
        <p className="text-gray-600 mb-12">Latest news and updates from the federation</p>

        {articles.length > 0 ? (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-bold mb-3 text-gray-900">{article.title}</h2>

                <div className="text-sm text-gray-600 mb-4">
                  <span>By {article.author_name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>

                <p className="text-gray-700 mb-6 line-clamp-4">{article.content}</p>

                <Link
                  href={`/news/${article.id}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
                >
                  Read Full Article →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No news articles yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await api.get('/news', { params: { limit: 20 } });
    return {
      props: {
        articles: response.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      props: {
        articles: [],
      },
    };
  }
}
