import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const { token, logOut } = useUser();

const isDev = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;
const rawBaseUrl = envApiUrl || (isDev ? "http://localhost:3000" : "https://api.erranders.org");
const cleanBaseUrl = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = cleanBaseUrl;
const $GATEWAY_ENDPOINT = `${cleanBaseUrl}/api/v1`;
const $GATEWAY_ENDPOINT_V2 = `${cleanBaseUrl}/v2`;
const $IMAGE_UPLOAD_ENDPOINT = cleanBaseUrl;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.interceptors.request.use((config: any) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    async (err: any) => {
      const originalRequest = err.config;

      if (typeof err.response === "undefined") {
        showToast({
          title: "Error",
          message: "kindly check your network connection",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject(err);
      }

      if (err.response.status === 401) {
        // Try refresh token logic
        const { refreshToken, setToken, setRefreshToken, logOut } = useUser();
        
        if (refreshToken.value && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshRes = await axios.post(`${$GATEWAY_ENDPOINT}/auth/refresh`, {
              refreshToken: refreshToken.value
            });
            
            if (refreshRes.data.token) {
              setToken(refreshRes.data.token);
              if (refreshRes.data.refreshToken) {
                setRefreshToken(refreshRes.data.refreshToken);
              }
              // Update Authorization header and retry original request
              originalRequest.headers.Authorization = `Bearer ${refreshRes.data.token}`;
              return instance(originalRequest);
            }
          } catch (refreshErr) {
            console.log('Refresh token failed:', refreshErr);
            logOut();
          }
        } else {
          logOut();
        }

        showToast({
          title: "Session Expired",
          message: "Please log in again.",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject(err);
      } 
      
      if (statusCodeStartsWith(err.response.status, 4) || err.response.status === 500) {
        if (err.response.data?.message || err.response.data?.error) {
          showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
      }
      return Promise.reject(err);
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
