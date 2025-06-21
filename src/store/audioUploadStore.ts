import { create } from "zustand";
import { CloudinaryAudioResource } from "@/types";

interface UploadStore {
  uploadedAudio: CloudinaryAudioResource | null;
  setUploadedAudio: (data: CloudinaryAudioResource) => void;
}

const useAudioUploadStore = create<UploadStore>((set) => ({
  uploadedAudio: null,
  setUploadedAudio: (data) => set({ uploadedAudio: data }),
}));

export default useAudioUploadStore;
