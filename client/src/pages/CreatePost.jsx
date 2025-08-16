import React, { useState, useEffect, useContext } from "react";
import {
  createPost,
  uploadImage,
  uploadVideo,
  fetchCategories,
  fetchTags,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [body, setBody] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories & tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetchCategories(),
          fetchTags(),
        ]);
        setCategories(catRes.data || []);
        setTags(tagRes.data || []);
      } catch (err) {
        console.error("Failed to load categories/tags", err);
      }
    };
    loadData();
  }, []);

  // File select (for both image & video)
  const handleUploadFile = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (type === "image") {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  // Tags
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setSelectedTags((prev) => [...new Set([...prev, tagInput.trim()])]);
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // Upload helper (image/video)
  const handleUpload = async (file, type) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append(type, file);
    try {
      const res = type === "image" ? await uploadImage(fd) : await uploadVideo(fd);

      // ✅ Backend controller returns "filePath", not "image_url" or "video_url"
      return res.data.filePath;
    } catch (err) {
      console.error(`Failed to upload ${type}`, err);
      throw new Error(`Upload ${type} failed`);
    }
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");

    setLoading(true);
    setError("");

    try {
      const uploadedImageUrl = await handleUpload(imageFile, "image");
      const uploadedVideoUrl = await handleUpload(videoFile, "video");

      const payload = {
        title,
        snippet,
        body,
        image_url: uploadedImageUrl || null,
        video_url: uploadedVideoUrl || null,
        category_id: categoryId || null,
        tags: selectedTags,
      };

      const res = await createPost(payload);
      navigate(`/post/${res.data.post.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Create New Post</h1>
      {error && <div className="text-red-600 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Snippet"
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          required
        />

        {/* Category */}
        <select
          className="w-full p-3 border bg-gray-800 rounded-lg"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>
            {categories.length === 0
              ? "Loading categories..."
              : "Select category"}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Tags */}
        <div>
          <label className="block mb-2 font-medium">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 rounded-lg hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedTags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="10"
          placeholder="Full body (HTML or markdown)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        {/* Image upload */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <button
            type="button"
            onClick={() => handleUploadFile("image")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Image
          </button>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-2 w-full max-h-64 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Video upload */}
        <div>
          <label className="block mb-1 font-medium">Video (mp4)</label>
          <button
            type="button"
            onClick={() => handleUploadFile("video")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Upload Video
          </button>
          {videoPreview && (
            <video
              controls
              src={videoPreview}
              className="mt-2 w-full max-h-64 rounded-lg"
            />
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
