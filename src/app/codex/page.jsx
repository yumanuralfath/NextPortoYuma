"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginService, registerService } from "@/lib/auth";
import { useRouter } from "next/navigation";

const CodexPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        const { email, password } = formData;
        response = await loginService({ email, password });
      } else {
        response = await registerService(formData);
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/threaded/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = (loading, isLogin) => {
    if (loading) return "Memproses...";
    return isLogin ? "Login ke Codex" : "Daftar Akun Baru";
  };

  const getButtonClassName = (isCurrentLogin, isLoginButton) => {
    const isActive = isLoginButton ? isCurrentLogin : !isCurrentLogin;
    return `flex-1 py-4 text-lg font-semibold transition-colors ${
      isActive
        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
        : "bg-gray-50 text-gray-500 hover:text-gray-700"
    }`;
  };

  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-indigo-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          The Threaded Codex
        </h1>
        <p className="text-gray-700 text-center mb-16 text-lg font-medium">
          Every Word a Page, Every Comment a Chapter.
        </p>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex mb-4">
              <button
                className={getButtonClassName(isLogin, true)}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={getButtonClassName(isLogin, false)}
                onClick={() => setIsLogin(false)}
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
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="Masukkan username Anda"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Masukkan email Anda"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Masukkan password Anda"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getButtonText(loading, isLogin)}
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
