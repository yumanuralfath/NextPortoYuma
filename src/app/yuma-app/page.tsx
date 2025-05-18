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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="min-h-screen p-8 pt-24  bg-black text-white font-mono from-indigo-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Easy Access to My App
        </h1>
        <p className="text-gray-700 text-center mb-16 text-lg font-medium">
          Enjoy hassle-free access to all my applications
        </p>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex mb-4">
              <button
                className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                    : "bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => !loading && setIsLogin(true)}
                disabled={loading}
              >
                Login
              </button>
              <button
                className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                    : "bg-gray-50 text-gray-500 hover:text-gray-700"
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
                      placeholder="Enter your username"
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                  />
                </div>
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
