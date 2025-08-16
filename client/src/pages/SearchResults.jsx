import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchPosts } from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = searchParams.get('search')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const sort = searchParams.get('sort')?.trim() || 'created_at';

  useEffect(() => {
    if (!searchTerm) {
      setPosts([]);
      return;
    }
    setLoading(true);

    const params = {
      search: searchTerm,
      page: 1,
      limit: 12,
      sort,
    };
    if (category) params.category = category;

    searchPosts(params)
      .then((res) => setPosts(res.data.posts))
      .catch((err) => {
        console.error('SearchPosts API error:', err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [searchTerm, category, sort]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{searchTerm}"
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="border rounded p-4 shadow hover:shadow-lg block bg-white"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p className="text-sm text-gray-600">
                By {post.author} • {post.category || 'Uncategorized'}
              </p>
              <p className="mt-2">{post.snippet}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
