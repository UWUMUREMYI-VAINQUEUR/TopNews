import axios from 'axios';

// Use environment variable for backend URL
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  // withCredentials: true // enable if using cookies
});

// Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ====== Posts ======
export const searchPosts = (params) => API.get('/posts/search', { params });
export const getPostsByAuthor = (userId) => API.get(`/posts/author/${userId}`);
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);

// 🔥 FIXED: now accepts params (query string)
export const fetchPosts = (query = '') => API.get(`/posts${query}`);

export const getLikesDislikes = (id) => API.get(`/posts/${id}/likes-dislikes-count`);
export const getUserReaction = (id) => API.get(`/posts/${id}/user-reaction`);
export const reactToPost = (id, type) => API.post(`/posts/${id}/like`, { type });

// ====== Comments ======
export const getCommentsByPost = (postId) => API.get(`/comments/post/${postId}`);
export const addComment = (payload) => API.post('/comments', payload);
export const reactToComment = (payload) => API.post('/comments/react', payload);

// ====== Users ======
export const loginApi = (payload) => API.post('/auth/login', payload);
export const signupApi = (payload) => API.post('/auth/signup', payload);
export const verify2FA = (payload) => API.post('/auth/verify-2fa', payload);

export const getUserProfile = (username) => API.get(`/users/${username}`);
export const updateUserProfile = (payload) => API.put('/users/update', payload);

// ====== Follows ======
export const followUser = (payload) => API.post('/followers/follow', payload);
export const unfollowUser = (payload) => API.post('/followers/unfollow', payload);

// ====== Categories & tags ======
export const fetchCategories = () => API.get('/categories');
export const fetchTags = () => API.get('/tags');

// ====== Bookmarks ======
export const addBookmark = (payload) => API.post('/bookmarks/add', payload);
export const removeBookmark = (payload) => API.post('/bookmarks/remove', payload);
export const getBookmarks = () => API.get('/bookmarks');

// ====== Upload ======
export const uploadImage = (formData) => API.post('/upload/image', formData);

// ====== Notifications ======
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (payload) => API.post('/notifications/read', payload);

// ====== Profile ======
export const getProfile = (username) => API.get(`/profile/${username}`);
export const updateProfile = (formData) => API.put('/profile/update', formData);

// Upload video
export const uploadVideo = (formData) => API.post('/upload/video', formData);

export default API;
