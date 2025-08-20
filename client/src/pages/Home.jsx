import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaBusinessTime, FaLaptopCode, FaFilm, FaMusic, FaHeartbeat,
  FaChartLine, FaFutbol, FaShieldAlt, FaUserPlus, FaUserCheck
} from 'react-icons/fa';
import {
  fetchCategories,
  fetchPosts,
  followUser,
  unfollowUser,
} from '../services/api'; // ✅ use API service

const categoryIcons = {
  business: <FaBusinessTime />,
  technology: <FaLaptopCode />,
  showbiz: <FaFilm />,
  music: <FaMusic />,
  healthy: <FaHeartbeat />,
  economic: <FaChartLine />,
  sports: <FaFutbol />,
  security: <FaShieldAlt />,
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;
  const [loading, setLoading] = useState(false);

  // ✅ Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // ✅ Load posts function
  const loadPosts = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    const offset = reset ? 0 : page * limit;
    let query = `?limit=${limit}&offset=${offset}`;
    if (selectedCategory) query += `&category=${selectedCategory}`;
    if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;

    try {
      const res = await fetchPosts(query || '');  // ✅ fixed
      if (reset) setPosts(res.data);
      else setPosts(prev => [...prev, ...res.data]);

      setHasMore(res.data.length === limit);
      setPage(prevPage => reset ? 1 : prevPage + 1); // ✅ fixed
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load posts on category change
  useEffect(() => {
    loadPosts(true);
  }, [selectedCategory]);

  // ✅ Search submit
  const onSearchSubmit = (e) => {
    e.preventDefault();
    loadPosts(true);
  };

  // ✅ Follow / Unfollow
  const handleFollow = async (authorId) => {
    try {
      await followUser({ followed_user_id: authorId });
      setPosts(prev => prev.map(p => p.author_id === authorId ? { ...p, followed: true } : p));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async (authorId) => {
    try {
      await unfollowUser({ followed_user_id: authorId });
      setPosts(prev => prev.map(p => p.author_id === authorId ? { ...p, followed: false } : p));
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Search */}
      <form onSubmit={onSearchSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-grow dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories Sidebar */}
        <aside className="flex md:flex-col gap-3 md:w-40 overflow-x-auto md:overflow-visible">
          <button
            onClick={() => setSelectedCategory('')}
            className={`flex flex-col items-center gap-1 py-3 rounded-lg border transition-transform
              ${selectedCategory === '' ? 'bg-blue-600 text-white scale-110 font-semibold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white'}
              focus:outline-none min-w-[72px]`}
          >
            <span className="text-2xl">📋</span>
            <span className="text-xs md:text-sm font-medium">All</span>
          </button>

          {categories.map(cat => {
            const lowerName = cat.name.toLowerCase();
            const icon = categoryIcons[lowerName] || <FaBusinessTime />;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-lg border transition-transform
                  ${isSelected ? 'bg-blue-600 text-white scale-110 font-semibold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white'}
                  focus:outline-none min-w-[72px]`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs md:text-sm font-medium capitalize">{cat.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Posts Grid */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="border rounded-lg p-4 shadow hover:shadow-lg bg-white dark:bg-gray-800 transition-colors flex flex-col justify-between">
              {/* Post Author */}
              <div className="flex items-center gap-2 mb-2">
                {post.author_avatar_url && (
                  <img src={post.author_avatar_url} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
                )}
                <span className="text-gray-800 dark:text-gray-100 font-medium">{post.author}</span>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover mb-2 rounded" />
              )}

              {/* Post Info */}
              <div className="mb-2">
                <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">{post.title}</h2>
                <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">{post.snippet}</p>

                {/* Follow / Unfollow */}
                {user && user.id !== post.author_id && (
                  <button
                    onClick={() => post.followed ? handleUnfollow(post.author_id) : handleFollow(post.author_id)}
                    className={`mt-2 flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
                      post.followed
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {post.followed ? <FaUserCheck /> : <FaUserPlus />}
                    {post.followed ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              <Link to={`/post/${post.id}`} className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Read More
              </Link>
            </div>
          ))}
        </main>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button onClick={() => loadPosts()} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
