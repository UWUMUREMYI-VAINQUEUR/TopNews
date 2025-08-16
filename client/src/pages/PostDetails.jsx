import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getPost,
  getLikesDislikes,
  getUserReaction,
  reactToPost,
  getCommentsByPost,
  addComment,
  followUser,
  unfollowUser,
  addBookmark,
  removeBookmark
} from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaArrowLeft, 
  FaUserPlus, 
  FaUserCheck, 
  FaBookmark, 
  FaRegBookmark 
} from 'react-icons/fa';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [bookmarked, setBookmarked] = useState(false); // ✅ new state for bookmark

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await Promise.all([loadPost(), loadCounts(), loadComments()]);
        if (user) {
          await loadUserReaction();
          await checkBookmark();
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [id, user]);

  const loadPost = async () => {
    const res = await getPost(id);
    setPost({ ...res.data, followed: res.data.followed ?? false });
  };

  const loadCounts = async () => {
    const res = await getLikesDislikes(id);
    setLikes(res.data.likes);
    setDislikes(res.data.dislikes);
  };

  const loadUserReaction = async () => {
    const res = await getUserReaction(id);
    setUserReaction(res.data.reaction);
  };

  const loadComments = async () => {
    const res = await getCommentsByPost(id);
    setComments(res.data);
  };

  // --- Check if post is bookmarked ---
  const checkBookmark = async () => {
    try {
      // Assuming getUserBookmarks returns an array of bookmarked posts
      const res = await fetch('/api/bookmarks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const bookmarks = await res.json();
      const isBookmarked = bookmarks.some(b => b.id === parseInt(id));
      setBookmarked(isBookmarked);
    } catch (err) {
      console.error('Failed to check bookmark', err);
    }
  };

  const handleReact = async (type) => {
    if (!user) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }
    try {
      await reactToPost(id, type);
      await loadCounts();
      await loadUserReaction();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }
    try {
      if (post.followed) {
        await unfollowUser({ followed_user_id: post.author_id });
      } else {
        await followUser({ followed_user_id: post.author_id });
      }
      setPost(prev => ({ ...prev, followed: !prev.followed }));
    } catch (err) {
      console.error(err);
    }
  };

  // --- New handleBookmark ---
  const handleBookmark = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }
    try {
      if (bookmarked) {
        await removeBookmark({ post_id: id });
      } else {
        await addBookmark({ post_id: id });
      }
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }
    if (!commentBody.trim()) return;
    
    try {
      await addComment({ 
        post_id: id, 
        body: commentBody.trim(), 
        parent_comment_id: replyTo || null 
      });
      setCommentBody('');
      setReplyTo(null);
      await loadComments();
    } catch (err) {
      console.error(err);
    }
  };

  const renderReplies = (parentId) => {
    return comments
      .filter(c => c.parent_comment_id === parentId)
      .map(reply => (
        <div key={reply.id} className="ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{reply.commenter_name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(reply.created_at).toLocaleString()}
            </span>
            {user && user.id === reply.user_id && (
              <span className="text-xs text-green-600 ml-2">(You)</span>
            )}
          </div>
          <div className="mt-1">{reply.body}</div>
          {!replyTo && (
            <button 
              onClick={() => setReplyTo(reply.id)}
              className="mt-1 text-blue-600 text-sm hover:underline"
            >
              Reply
            </button>
          )}
          {renderReplies(reply.id)}
        </div>
      ));
  };

  if (loading) return <div className="text-center py-10">Loading post...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
        <FaArrowLeft /> Back to News
      </Link>

      {/* Post Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg sm:text-xl">
          {post.author}
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
          {post.category && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{post.category}</span>
          )}
        </div>
      </div>

      {/* Post Image & Snippet */}
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      {post.snippet && (
        <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-6">{post.snippet}</p>
      )}

      {/* Likes / Dislikes / Follow / Bookmark */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <button 
          onClick={() => handleReact('like')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            userReaction === 'like'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <FaThumbsUp /> {likes}
        </button>

        <button 
          onClick={() => handleReact('dislike')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            userReaction === 'dislike'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <FaThumbsDown /> {dislikes}
        </button>

        {user && post && user.id !== post.author_id && (
          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-all shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              post.followed
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
            }`}
          >
            {post.followed ? <FaUserCheck className="text-green-600" /> : <FaUserPlus />}
            {post.followed ? 'Following' : 'Follow'}
          </button>
        )}

        {/* Bookmark Button */}
        {user && (
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-all shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              bookmarked
                ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
      </div>

      {/* Post Body */}
      <div 
        className="prose max-w-none mb-8 dark:prose-invert" 
        dangerouslySetInnerHTML={{ __html: post.body }} 
      />

      {/* Comments */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Comments ({comments.length})</h2>
        <div className="mb-6">
          <textarea
            rows="4"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            placeholder={replyTo ? `Replying to comment #${replyTo}` : 'Add your comment...'}
          />
          <div className="flex justify-end gap-3 mt-2">
            {replyTo && (
              <button 
                onClick={() => setReplyTo(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={handleSubmitComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!commentBody.trim()}
            >
              Post Comment
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {comments
            .filter(comment => !comment.parent_comment_id)
            .map(comment => (
              <div key={comment.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{comment.commenter_name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  {user && user.id === comment.user_id && (
                    <span className="text-xs text-green-600 ml-2">(You)</span>
                  )}
                </div>
                <p className="mb-3">{comment.body}</p>
                <button 
                  onClick={() => setReplyTo(comment.id)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Reply
                </button>
                {renderReplies(comment.id)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
