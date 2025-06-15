/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { registerService } from "@/lib/auth";
import toast from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
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
      });
      setLoading(false);
      return;
    }

    const request = (async () => {
      try {
        await registerService(formData);
        onSuccess?.();
      } catch (err: any) {
        throw new Error(err.message || "Registration failed");
      }
    })();

    toast
      .promise(
        request,
        {
          loading: "Registering...",
          success: "Registration successful!",
          error: (err) => err.message || "Register failed.",
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
      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="text-sm block text-[#00f0ff] mb-1 drop-shadow-[0_0_5px_#00f0ff]"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-[#00f0ff] text-[#00f0ff] placeholder-[#00f0ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[0_0_5px_#00f0ff66]"
          placeholder="Username"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="text-sm block text-[#00f0ff] mb-1 drop-shadow-[0_0_5px_#00f0ff]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-[#00f0ff] text-[#00f0ff] placeholder-[#00f0ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[0_0_5px_#00f0ff66]"
          placeholder="email@domain.com"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="text-sm block text-[#00f0ff] mb-1 drop-shadow-[0_0_5px_#00f0ff]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-[#00f0ff] text-[#00f0ff] placeholder-[#00f0ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[0_0_5px_#00f0ff66]"
          placeholder="••••••••"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm block text-[#00f0ff] mb-1 drop-shadow-[0_0_5px_#00f0ff]"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-black/50 border border-[#00f0ff] text-[#00f0ff] placeholder-[#00f0ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[0_0_5px_#00f0ff66]"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-[#00f0ff] to-[#aa00ff] text-black font-bold rounded-lg transition-all duration-300 ease-in-out hover:from-[#aa00ff] hover:to-[#00f0ff] hover:shadow-[0_0_15px_#aa00ff66,0_0_15px_#00f0ff66] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
