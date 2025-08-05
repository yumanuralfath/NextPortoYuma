/* eslint-disable @typescript-eslint/no-explicit-any */
import { getJsonWithToken, postJsonWithToken, putJsonWithToken, deleteJsonWithToken } from "./fetchLib";
import { withErrorHandler } from "./withErrorHandler";
import BASE_URL from "./baseUrl";

const LOGS_API_URL = `${BASE_URL}/logs`;

export const getLogBooks = (page: number = 1, limit: number = 10) => {
  return withErrorHandler(async () => {
    const url = `${LOGS_API_URL}?page=${page}&limit=${limit}`;
    const result = await getJsonWithToken(url, false);
    return result;
  }, "Failed to fetch log books");
};

export const getLogBookById = (id: string) => {
  return withErrorHandler(async () => {
    return getJsonWithToken(`${LOGS_API_URL}/${id}`, false);
  }, "Failed to fetch log book");
};

export const createLogBook = (data: any) => {
  return withErrorHandler(async () => {
    return postJsonWithToken(LOGS_API_URL, data);
  }, "Failed to create log book");
};

export const updateLogBook = (id: string, data: any) => {
  return withErrorHandler(async () => {
    return putJsonWithToken(`${LOGS_API_URL}/${id}`, data);
  }, "Failed to update log book");
};

export const deleteLogBook = (id: string) => {
  return withErrorHandler(async () => {
    return deleteJsonWithToken(`${LOGS_API_URL}/${id}`);
  }, "Failed to delete log book");
};
