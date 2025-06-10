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
      <div className="bg-gradient-to-br from-black via-[#00f7ff] to-[#ff00e670] p-6 rounded-md max-w-sm w-full relative">
        <h2 className="text-xl mb-4 text-white">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {/* Form Konten */}
        {mode === "login" ? (
          <LoginForm onSuccess={onSuccessLogin} />
        ) : (
          <RegisterForm onSuccess={onSuccessLogin} />
        )}

        {/* Switch Mode */}
        <div className="mt-4 text-sm">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => onSwitchMode("register")}
                className="text-white underline"
              >
                Daftar
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => onSwitchMode("login")}
                className="text-blue-500 underline"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
