import React from "react";
import { AxiosInstance } from "./axiosInstance";
import { urls } from "../apiUrls/urls";

const getData = async (method, payload) => {
  let response;
  try {
    switch (method.toLowerCase()) {
        case "get":
        response = await AxiosInstance.get(urls.pexelsLiberaryUrl, { params: payload });
        break;

      default:
        throw new Error(`Unsupported Method ${method}`);
    }
  } catch (e) {
    console.log("axios failed to fetch", e);
  }
  return response;
};

const axiosCaller = (method, payload) => getData(method, payload);

export { axiosCaller };
