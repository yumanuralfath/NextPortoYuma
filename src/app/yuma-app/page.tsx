/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { loginService, registerService } from "../../lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setAccessToken } from "@/lib/fetchLib";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  username: string;
}

const CodexPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    const request = (async () => {
      try {
        if (isLogin) {
          const response = await loginService({
            email: formData.email,
            password: formData.password,
          });
          localStorage.setItem("user", JSON.stringify(response.user));
          setAccessToken(response.token);
          router.push("/app");
        } else {
          await registerService(formData);
          window.location.reload();
        }
      } catch (err: any) {
        throw new Error(err.message || "An error occurred");
      }
    })();

    toast
      .promise(request, {
        loading: isLogin ? "Logging in..." : "Registering...",
        success: isLogin ? "Login successful!" : "Register successful!",
        error: (err) => err.message || "An error occurred. Please try again.",
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen p-8 pt-24 bg-black text-[#00ffe7] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_#0ff]">
          👾 CYBERPORTAL 👾
        </h1>
        <p className="text-center mb-16 text-lg font-medium text-[#39ff14]">
          Jack in. Secure. Access the grid.
        </p>

        <div className="w-full max-w-md neon-border p-1 rounded-xl">
          <div className="bg-black rounded-xl shadow-[0_0_20px_#0ff]">
            <div className="flex mb-4">
              <button
                className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                  isLogin
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_10px_#ff00ff]"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
                onClick={() => !loading && setIsLogin(true)}
                disabled={loading}
              >
                Login
              </button>
              <button
                className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                  !isLogin
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_10px_#ff00ff]"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
                onClick={() => !loading && setIsLogin(false)}
                disabled={loading}
              >
                Register
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="username"
                      className="text-sm mb-2 block text-[#0ff]"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded bg-gray-900 border border-[#0ff] focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
                      placeholder="NeoUserX"
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm mb-2 block text-[#0ff]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-gray-900 border border-[#0ff] focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
                    placeholder="alfath@cyber.net"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm mb-2 block text-[#0ff]"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-gray-900 border border-[#0ff] focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm mb-2 block text-[#0ff]"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded bg-gray-900 border border-[#0ff] focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
                      placeholder="••••••••"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-bold hover:from-cyan-400 hover:to-pink-400 transition-all shadow-[0_0_15px_#0ff] disabled:opacity-50"
                >
                  {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodexPage;
