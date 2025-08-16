// src/pages/NewsDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/news/${id}`);
        setNews(res.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!news) return <div className="text-center mt-10 text-red-500">News not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

      {/* Meta Info */}
      <div className="text-gray-500 text-sm mb-6">
        By {news.author || "Admin"} | {new Date(news.created_at).toLocaleDateString()}
      </div>

      {/* Image */}
      {news.image && (
        <img
          src={`http://localhost:5000/uploads/${news.image}`}
          alt={news.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      {/* Body */}
      <div className="prose max-w-none">
        {news.body}
      </div>
    </div>
  );
};

export default NewsDetail;
