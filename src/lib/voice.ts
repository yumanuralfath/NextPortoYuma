import { CloudinaryAudioResource, GetVoicesResponse } from "@/types";

export async function getVoices(
  userID: string,
  date?: string
): Promise<CloudinaryAudioResource[]> {
  const params = new URLSearchParams({ userID });
  if (date) {
    params.set("date", date);
  }

  const res = await fetch(`/api/upload/audio?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch voices: ${res.statusText}`);
  }

  const data: GetVoicesResponse = await res.json();
  return data.audios;
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
