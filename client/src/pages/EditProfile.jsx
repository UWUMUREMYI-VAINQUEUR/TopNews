import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api'; // API helper
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { user, setUser } = useContext(AuthContext); // now setUser is available
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null); // selected file
  const [preview, setPreview] = useState(''); // image preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize form with current user info
  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setPreview(user.avatar_url || '');
    }
  }, [user]);

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // show local preview
    }
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (avatar) formData.append('avatar', avatar);

      const res = await updateProfile(formData); // API call

      // Update message
      setMessage(res.data.message || 'Profile updated successfully');

      // Update user in context and localStorage
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          bio,
          avatar_url: res.data.avatar_url || prev.avatar_url,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });

      // Optional: redirect to profile page
      // navigate(`/profile/${user.username}`);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {message && (
        <div className={`mb-4 text-center ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full border"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell something about yourself..."
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
