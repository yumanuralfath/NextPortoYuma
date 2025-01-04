import { useState, useEffect, useCallback } from "react";

const CommentList = ({ threadId, token }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [usernames, setUsernames] = useState({});

  // Fetch username for a specific user_id
  const fetchUsername = useCallback(
    async (userId) => {
      if (usernames[userId]) return; // Skip if already fetched

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/username/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch username");
        }

        const data = await response.json();
        setUsernames((prev) => ({ ...prev, [userId]: data.username }));
      } catch (err) {
        console.error(`Error fetching username for user_id ${userId}:`, err);
      }
    },
    [token, usernames]
  );

  // Fetch comments when page or threadId changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/${threadId}?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load comments");
        }

        const data = await response.json();

        // Check if there are comments to append
        if (data.comments.length === 0) {
          setHasMore(false);
        } else {
          setComments((prev) => [...prev, ...data.comments]);

          // Fetch usernames for new comments
          data.comments.forEach((comment) => {
            fetchUsername(comment.user_id);
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [page, threadId, token, fetchUsername]);

  // Reset state when threadId changes
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [threadId]);

  if (loading && page === 1) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error}</p>;

  return (
    <div className="comment-list mt-4">
      {comments.map((comment) => (
        <div
          key={`${comment.id}-${threadId}`}
          className="comment mb-2 p-2 border rounded"
        >
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-sm text-gray-500">
            — {usernames[comment.user_id] || "Loading..."}
          </p>
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 rounded mt-2"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
      {!hasMore && (
        <p className="text-gray-500 mt-2">No more comments to load.</p>
      )}
    </div>
  );
};

export default CommentList;
