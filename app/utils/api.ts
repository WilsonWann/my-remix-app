import axios, { AxiosError, AxiosResponse } from 'axios';
import { CustomAxiosInstance, ApiResponse, ApiError } from './types';

const api: CustomAxiosInstance = axios.create({
  baseURL: 'http://10.88.0.106:3000',
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message,
    };

    if (error.response) {
      apiError.response = error.response as ApiResponse;
    } else if (error.request) {
      apiError.request = error.request;
    }

    throw apiError;
  }
);

export default api;