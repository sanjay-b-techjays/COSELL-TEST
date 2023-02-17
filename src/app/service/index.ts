/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import axios from 'axios';
// axios.defaults.withCredentials = true
// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const multiPartRequest = async (
  url: string,
  bodyData = new FormData(),
  headerData = {}
) => {
  const headersData = { ...headerData, 'Content-Type': 'multipart/form-data' };
  const response = await axios
    .post(url, bodyData, {
      headers: headersData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};

export const multiPartPutRequest = async (
  url: string,
  bodyData = new FormData(),
  headerData = {}
) => {
  const headersData = { ...headerData, 'Content-Type': 'multipart/form-data' };
  const response = await axios
    .put(url, bodyData, {
      headers: headersData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};
export const postRequest = async (
  url: string,
  bodyData = {},
  headerData = {}
) => {
  const response = await axios
    .post(url, bodyData, {
      headers: headerData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};

export const getRequest = async (url: string, headerData = {}) => {
  const response = await axios
    .get(url, {
      headers: headerData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};

export const getPdfRequest = async (url: string, headerData = {}) => {
  const response = await axios
    .get(url, {
      headers: headerData,
      responseType: 'blob',
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};

export const patchRequest = async (
  url: string,
  bodyData = {},
  headerData = {}
) => {
  const response = await axios
    .patch(url, bodyData, {
      headers: headerData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};

export const putRequest = async (
  url: string,
  bodyData = {},
  headerData = {}
) => {
  const response = await axios
    .put(url, bodyData, {
      headers: headerData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};

export const deleteRequest = async (
  url: string,
  headerData = {},
  bodyData = {}
) => {
  const response = await axios
    .delete(url, {
      headers: headerData,
      data: bodyData,
    })
    .then((res: any) => res.data)
    .catch((err: any) => err.response);
  const resp = await response;
  return resp;
};
