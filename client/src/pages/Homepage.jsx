import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, searchPosts } from '../services/api'; // use searchPosts for loading posts by category or all

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load categories once on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  // Load posts whenever selectedCategory changes
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // If category selected, send it as a filter param q=categoryName or category_id
        const params = selectedCategory ? { category: selectedCategory } : {};
        const res = await searchPosts(params);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">News</h1>

      <div className="mb-6">
        <label className="mr-3 font-semibold">Filter by category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="border rounded px-3 py-1"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading && <div>Loading posts...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && posts.length === 0 && (
        <div>No posts found.</div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">
              <Link to={`/posts/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-700 mb-2">{post.snippet}</p>
            <div className="text-sm text-gray-500 flex justify-between">
              <span>By {post.author}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
