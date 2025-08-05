"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import TextEditor from "@/components/General/TextEditor";
import AuthModal from "@/components/General/AuthModal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getLogBookById, updateLogBook } from "@/lib/LogBook";
import { DiaryEntry } from "@/types";

export default function EditLogEntryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user } = useUserStore();
  const { accessToken } = useAuthStore();

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "unauthorized" | "forbidden" | "authorized"
  >("loading");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  const toastId = useRef<string | null>(null);

  useEffect(() => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }

    try {
      const storedUser = localStorage.getItem("user-local");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.state?.user?.is_admin) {
          setStatus("authorized");
          setShowModal(false);
          if (!user?.is_admin) {
            useUserStore.setState({ user: parsedUser.state.user });
          }
          return;
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }

    const isAuthenticated = !!accessToken;

    if (isAuthenticated && !user) {
      toastId.current = toast.loading("Verifying user permissions...");
      setStatus("loading");
      return;
    }

    if (!isAuthenticated) {
      setStatus("unauthorized");
      toast("Please log in as an admin to continue.", { icon: "🔒" });
      setShowModal(true);
    } else if (!user?.is_admin) {
      setStatus("forbidden");
      toast.error("Access Denied: You are not an admin.");
      router.push("/log-book");
    } else {
      setStatus("authorized");
      toast.success("Permissions verified. Welcome!");
      setShowModal(false);
    }

    return () => {
      if (toastId.current) toast.dismiss(toastId.current);
    };
  }, [accessToken, user, router]);

  useEffect(() => {
    if (status === "authorized" && typeof id === "string") {
      const fetchEntry = async () => {
        setIsLoading(true);
        const fetchedEntry = await getLogBookById(id);
        if (fetchedEntry) {
          setEntry(fetchedEntry);
        } else {
          toast.error("Could not find the requested entry.");
          router.push("/log-book");
        }
        setIsLoading(false);
      };
      fetchEntry();
    }
  }, [id, status, router]);

  const handleSave = async (content: string) => {
    if (!entry) return;

    setIsSaving(true);
    const updatedEntry = {
      ...entry,
      content: content,
    };

    const result = await updateLogBook(entry.id, updatedEntry);

    if (result) {
      toast.success("Entry updated successfully!");
      router.push("/log-book");
    }

    setIsSaving(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/log-book");
  };

  const handleSuccessLogin = () => {
    window.location.reload();
  };

  if (status !== "authorized") {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-slate-900/50" />
        {showModal && (
          <AuthModal
            mode={modalMode}
            onClose={handleCloseModal}
            onSwitchMode={setModalMode}
            onSuccessLogin={handleSuccessLogin}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900/50 text-white">
        Loading entry...
      </div>
    );
  }

  if (!entry) {
    return null; // Or a not found component
  }

  return (
    <div className="min-h-screen bg-slate-900/50 text-white font-mono p-4 sm:p-6 pt-24">
      <main className="max-w-4xl mx-auto">
        <Link
          href="/log-book"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Log Book
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-8">
          Edit Log Entry
        </h1>
        <TextEditor
          onSave={handleSave}
          isSaving={isSaving}
          initialText={entry.content}
        />
      </main>
    </div>
  );
}
