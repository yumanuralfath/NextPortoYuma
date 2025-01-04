"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThreadForm from "@/components/ThreadForm";
import ThreadList from "@/components/ThreadList";

const ThreadsPage = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("You need to log in first!");
      router.push("/codex");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // Fetch threads from API
  useEffect(() => {
    if (!token) return;

    const fetchThreads = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/threads?page=1&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load threads");
        }

        const data = await response.json();
        setThreads(data.threads || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [token]);

  const handleCreateThread = async (title, body) => {
    if (!title.trim() || !body.trim()) {
      alert("Title and body cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/thread`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, body }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create thread");
      }

      alert("Thread created successfully!");
      // Refresh thread list
      const updatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/threads?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      setThreads(updatedData.threads || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create thread.");
    }
  };

  if (!token) return <p>Loading...</p>;
  if (loading) return <p>Loading threads...</p>;
  if (error) return <p>Error loading threads: {error}</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Threads</h1>
        <ThreadForm onSubmit={handleCreateThread} />
        {Array.isArray(threads) && threads.length > 0 ? (
          <ThreadList threads={threads} token={token} />
        ) : (
          <p>No threads available. Create one!</p>
        )}
      </div>
    </div>
  );
};

export default ThreadsPage;
