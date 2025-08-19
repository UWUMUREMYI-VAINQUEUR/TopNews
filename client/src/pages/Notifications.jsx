import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationRead } from "../services/api"; // ✅ use your API service

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(); // ✅ now uses VITE_API_URL
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationRead({ notification_id: id }); // ✅ use API wrapper

      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const fromUser = n.sender_name || "Unknown";
            const senderId = n.data.from_user_id;
            const createdAt = new Date(n.created_at).toLocaleString();

            return (
              <li
                key={n.notification_id}
                className={`p-4 rounded-lg shadow transition-colors ${
                  n.read
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-yellow-100 dark:bg-yellow-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {n.data.message}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      From:{" "}
                      {senderId ? (
                        <Link
                          to={`/profile/${fromUser}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {fromUser}
                        </Link>
                      ) : (
                        fromUser
                      )}{" "}
                      | Post ID:{" "}
                      <Link
                        to={`/post/${n.data.post_id}`}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        {n.data.post_id}
                      </Link>{" "}
                      | Comment ID: {n.data.comment_id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.notification_id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Mark as Read
                      </button>
                    )}
                    <Link
                      to={`/post/${n.data.post_id}#comment-${n.data.comment_id}`}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
