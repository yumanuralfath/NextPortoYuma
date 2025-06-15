/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { loginService } from "@/lib/auth";
import toast from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const request = (async () => {
      try {
        await loginService({ email, password });
        onSuccess?.();
      } catch (err: any) {
        throw new Error(err.message || "An error occurred");
      }
    })();

    toast
      .promise(
        request,
        {
          loading: "Logging in...",
          success: "Login successful!",
          error: (err) => err.message || "Login failed.",
        },
        {
          style: {
            border: "2px solid #ff00ff",
            padding: "16px",
            color: "#00ffff",
            background: "#1a001a",
            boxShadow: "0 0 20px #ff00ff",
            fontFamily: "monospace",
          },
          iconTheme: {
            primary: "#00ffff",
            secondary: "#ff00ff",
          },
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Input Email */}
      <div>
        <label
          htmlFor="email"
          className="text-sm mb-2 block text-[#00f0ff] drop-shadow-[0_0_5px_#00f0ff]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-[#00f0ff] text-[#00f0ff] placeholder-[#00f0ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[0_0_5px_#00f0ff66]"
          placeholder="email@mailer.com"
        />
      </div>

      {/* Input Password */}
      <div>
        <label
          htmlFor="password"
          className="text-sm mb-2 block text-[#00f0ff] drop-shadow-[0_0_5px_#00f0ff]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-[#00f0ff] text-[#00f0ff] placeholder-[#00f0ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[0_0_5px_#00f0ff66]"
          placeholder="••••••••"
        />
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-[#00f0ff] to-[#aa00ff] text-black font-bold rounded-lg transition-all duration-300 ease-in-out hover:from-[#aa00ff] hover:to-[#00f0ff] hover:shadow-[0_0_15px_#aa00ff66,0_0_15px_#00f0ff66] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
