import React from 'react';
import { Link } from 'react-router-dom';

export default function NewsCard({ post }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-lg transition">
      <Link to={`/post/${post.id}`}>
        <img
          src={post.image_url || '/placeholder.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/post/${post.id}`} className="text-xl font-semibold hover:underline">
          {post.title}
        </Link>
        <p className="text-gray-600 mt-2">{post.snippet}</p>
        <div className="mt-3 flex justify-between text-sm text-gray-500">
          <span>By <Link to={`/profile/${post.author}`} className="hover:underline">{post.author}</Link></span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
