import {
  CloudinaryAudioResource,
  type deleteVoiceJournalbyID,
  GetVoicesResponse,
} from "@/types";
import BASE_URL from "./baseUrl";
import {
  deleteJsonWithToken,
  getJsonWithToken,
  postJsonWithToken,
} from "./fetchLib";
import { withErrorHandler } from "./withErrorHandler";

export async function getVoices(
  userID: string,
  date?: string
): Promise<CloudinaryAudioResource[]> {
  const params = new URLSearchParams({ userID });
  if (date) {
    params.set("date", date);
  }

  const res: GetVoicesResponse = await withErrorHandler(
    () => getJsonWithToken(`/api/upload/audio?${params.toString()}`, false),
    "Voice log not found or Empty, Please Record."
  );

  return res.audios;
}

export async function deleteVoices(userID: string, date?: string) {
  const params = new URLSearchParams({ userID });
  if (date) {
    params.set("date", date);
  }

  const res = await fetch(`/api/upload/audio?${params.toString()}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete voices: ${res.statusText}`);
  }

  const data = await res.json();
  return data.deleted as number;
}

export async function SaveVoiceJournalLog(voices_journal: string) {
  const payload = {
    voices_journal: voices_journal,
  };

  return await withErrorHandler(
    () => postJsonWithToken(`${BASE_URL}/voice`, payload),
    "Voice Save Failed"
  );
  // const response = await fetch(`${BASE_URL}/voice`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(payload),
  // });

  // const contentType = response.headers.get("content-type");

  // let data: any = null;

  // if (contentType && contentType.includes("application/json")) {
  //   try {
  //     data = await response.json();
  //   } catch {
  //     throw new Error("Gagal parsing respons JSON dari server.");
  //   }
  // } else {
  //   const text = await response.text();
  //   throw new Error(`${text}`);
  // }

  // if (!response.ok) {
  //   throw new Error(
  //     data?.error || data?.message || "Terjadi kesalahan dari server."
  //   );
  // }

  // return data;
}

export async function getVoiceJournalbyDate(date: string) {
  return await withErrorHandler(
    () => getJsonWithToken(`${BASE_URL}/voice/${date}`),
    "Error get voice journal"
  );
  // const response = await fetch(`${BASE_URL}/voice/${date}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // const data: GetVOicelogbyDate = await response.json();

  // if (data.data === null) {
  //   throw new Error(data.message);
  // }

  // if (!response.ok) {
  //   throw new Error(data?.message || "Gagal mengambil data.");
  // }

  // return data;
}

export async function deleteVoiceJournalbyID(id: string) {
  const data: deleteVoiceJournalbyID = await withErrorHandler(
    () => deleteJsonWithToken(`${BASE_URL}/voice/${id}`),
    "Delete voice failed"
  );

  return data.Message;
}

export async function getVoiceWeeklyResume() {
  return await withErrorHandler(
    () => getJsonWithToken(`${BASE_URL}/voice/weekly-resume`),
    "Get voice weekly failed"
  );
}

export async function getVoiceMonthlyResume() {
  return await withErrorHandler(
    () => getJsonWithToken(`${BASE_URL}/voice/monthly-resume`),
    "Faile to Get Data"
  );
}
