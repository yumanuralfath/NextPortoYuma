import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
  onSuccessLogin: () => void;
}

const AuthModal = ({
  mode,
  onClose,
  onSwitchMode,
  onSuccessLogin,
}: AuthModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-[#00f7ff] dark:to-[#ff00e670] p-6 rounded-md max-w-sm w-full relative shadow-lg">
        <h2 className="text-xl mb-4 text-slate-800 dark:text-white">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {/* Form Konten */}
        {mode === "login" ? (
          <LoginForm onSuccess={onSuccessLogin} />
        ) : (
          <RegisterForm onSuccess={onSuccessLogin} />
        )}

        {/* Switch Mode */}
        <div className="mt-4 text-sm text-slate-600 dark:text-white">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => onSwitchMode("register")}
                className="text-cyan-600 dark:text-white underline"
              >
                Daftar
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => onSwitchMode("login")}
                className="text-cyan-600 dark:text-white underline"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
