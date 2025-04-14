import { create } from "zustand";

interface UploadedAudio {
  url: string;
}

interface UploadStore {
  uploadedAudio: UploadedAudio | null;
  setUploadedAudio: (data: UploadedAudio) => void;
}

const useAudioUploadStore = create<UploadStore>((set) => ({
  uploadedAudio: null,
  setUploadedAudio: (data) => set({ uploadedAudio: data }),
}));

export default useAudioUploadStore;
