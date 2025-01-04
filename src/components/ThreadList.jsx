import { useState, useEffect, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./Commentlist";

const ThreadList = ({ threads, token }) => {
  const [usernames, setUsernames] = useState({});

  // Fetch username for a specific user_id wrapped in useCallback to avoid redefinition
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
    [usernames, token]
  ); // Adding `usernames` and `token` as dependencies

  useEffect(() => {
    // Fetch all usernames for the initial threads
    threads.forEach((thread) => {
      fetchUsername(thread.user_id);
    });
  }, [threads, fetchUsername]); // Add `fetchUsername` to the dependency array

  return (
    <ul className="space-y-4">
      {threads.map((thread) => (
        <li
          key={thread.id}
          className="p-4 bg-white rounded-lg shadow-md transition hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {thread.content}
          </h2>
          <p className="text-gray-600">{thread.body}</p>
          <p className="text-sm text-gray-500 mt-2">
            Posted by {usernames[thread.user_id] || "Loading..."}
          </p>
          {/* Comment List */}
          <CommentList threadId={thread.id} token={token} />
          {/* Comment Form */}
          <CommentForm threadId={thread.id} token={token} />
        </li>
      ))}
    </ul>
  );
};

export default ThreadList;
