import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
}

export type ApiError = {
  message: string;
  response?: ApiResponse;
  request?: any;
};

export interface CustomAxiosInstance extends AxiosInstance {
  (config: AxiosRequestConfig): Promise<ApiResponse>;
}