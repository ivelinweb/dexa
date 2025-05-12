import axios from "axios";
import { API_URL } from "@/config/env";
import { StorageTypes } from "@/libs/enum";
import { parseCookies } from "nookies";

const API = API_URL;

export async function getApi(url: string) {
  const parsedCookies = parseCookies();
  const cookie = parsedCookies[StorageTypes.ACCESS_TOKEN];
  const apiUrl = `${API}/${url}`;
  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
    .then((res) => res.data);
}

export const postApi = async (url: string, data: any) => {
  const parsedCookies = parseCookies();
  const cookie = parsedCookies[StorageTypes.ACCESS_TOKEN];
  const apiUrl = `${API}/${url}`;
  const payload = data;
  return axios
    .post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
    .then((res) => res.data);
};

export const deleteApi = async (url: string) => {
  const parsedCookies = parseCookies();
  const cookie = parsedCookies[StorageTypes.ACCESS_TOKEN];
  const apiUrl = `${API}/${url}`;
  return axios
    .delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
    .then((res) => res.data);
};

export const uploadApi = async (
  url: string,
  data: any
  //setProgress: (value: number) => void
) => {
  const parsedCookies = parseCookies();
  const cookie = parsedCookies[StorageTypes.ACCESS_TOKEN];
  const apiUrl = `${API_URL}/${url}`;
  const payload = data;
  return axios
    .post(apiUrl, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookie}`,
        "Access-Control-Allow-Credentials": true,
      },
      onUploadProgress: (progressEv) => {
        if (!progressEv.total) return;
        const percentage = Math.round(
          (progressEv.loaded * 100) / progressEv.total
        );
        console.log(percentage);
      },
    })
    .then((res) => res.data);
};
