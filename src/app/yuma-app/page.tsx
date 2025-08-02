/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { loginService, registerService } from "../../lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/fetchLib";
import { FormData } from "@/types";

const YumaAppPage = () => {
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
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await loginService({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Login successful!");
        router.push("/app");
      } else {
        await registerService(formData);
        toast.success("Register successful! Please login.");
        setIsLogin(true); // Switch to login view after registration
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 pt-24 bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-pink-500 dark:via-purple-500 dark:to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center mb-10 text-md sm:text-lg font-medium text-gray-600 dark:text-gray-400">
          Login or register to access apps.
        </p>

        <div className="w-full max-w-md bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-2xl">
          <div className="flex rounded-t-xl overflow-hidden">
            <button
              className={`flex-1 py-3 sm:py-4 text-md sm:text-lg font-semibold transition-colors duration-300 ${
                isLogin
                  ? "bg-blue-500 dark:bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => !loading && setIsLogin(true)}
              disabled={loading}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 text-md sm:text-lg font-semibold transition-colors duration-300 ${
                !isLogin
                  ? "bg-blue-500 dark:bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => !loading && setIsLogin(false)}
              disabled={loading}
            >
              Register
            </button>
          </div>

          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="username"
                    className="text-sm mb-2 block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 text-gray-800 dark:text-white placeholder-gray-500 transition"
                    placeholder="yourusername"
                    required
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm mb-2 block font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 text-gray-800 dark:text-white placeholder-gray-500 transition"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm mb-2 block font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 text-gray-800 dark:text-white placeholder-gray-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm mb-2 block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 text-gray-800 dark:text-white placeholder-gray-500 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-pink-500 dark:to-purple-600 dark:hover:from-pink-600 dark:hover:to-purple-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default YumaAppPage;
