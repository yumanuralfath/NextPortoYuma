/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { loginService, registerService } from "../../lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/fetchLib";
import { FormData } from "@/types";

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

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.push("/app");
    }
  }, [router]);

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
        if (isLogin) {
          await loginService({
            email: formData.email,
            password: formData.password,
          });
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
      .promise(
        request,
        {
          loading: isLogin ? "Logging in..." : "Registering...",
          success: isLogin ? "Login successful!" : "Register successful!",
          error: (err) => err.message || "An error occurred. Please try again.",
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
    <div className="min-h-screen p-8 pt-24 dark:bg-black dark:text-[#00ffe7] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-6 dark:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-blue-500 dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_10px_#0ff]">
          ♣️ My App ♠️
        </h1>
        <p className="text-center mb-16 text-lg font-medium text-gray-600 dark:text-[#39ff14]">
          Thanks for using My App!
        </p>

        <div className="w-full max-w-md dark:neon-border p-1 rounded-xl">
          <div className="bg-black rounded-xl dark:shadow-[0_0_20px_#0ff]">
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
                      placeholder="Username"
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
                    placeholder="email@mailer.com"
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
