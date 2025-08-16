import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import NewsCard from '../components/NewsCard';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile(username);
      setProfile(res.data.user);
      setPosts(res.data.posts || []);
    } catch (err) { console.error(err); }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img src={profile.avatar_url || '/placeholder-avatar.png'} alt={profile.username} className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(p => <NewsCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
