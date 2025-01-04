import { useState } from "react";

const ThreadForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await onSubmit(title, body);
      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("Error creating thread: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Create a Thread</h2>
      <input
        type="text"
        placeholder="Thread Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        placeholder="Thread Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        type="submit"
        disabled={creating}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {creating ? "Creating..." : "Create Thread"}
      </button>
    </form>
  );
};

export default ThreadForm;
