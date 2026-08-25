import axios from "axios";
import { useHandlerStore } from "~/store/handler";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const handlerStore = useHandlerStore();

  const api = axios.create({
    baseURL: config.public.API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // attach access token to every request
  api.interceptors.request.use((config) => {
    const token = useCookie("token").value;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  });

  // refresh access token on 401, and handle redirects / different status codes
  interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }
  let isRefreshing = false;
  let failedQueue: FailedRequest[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (
        status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/login") &&
        !originalRequest.url.includes("/auth/admin/login") &&
        !originalRequest.url.includes("/auth/logout") &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await axios.get(
              `${config.public.API_URL}auth/refresh`,
              {
                withCredentials: true,
              },
            );

            const newToken = data.data?.accessToken ?? data.accessToken;

            useCookie("token").value = newToken;
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            processQueue(null, newToken);

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          } catch (err) {
            processQueue(err, null);
            useCookie("token").value = null;
            handlerStore.setUnauthorized();
            reject(err);
          } finally {
            isRefreshing = false;
          }
        });
      }

      if (status === 403) {
        handlerStore.setForbidden();
      }

      if (error.response?.data?.redirect) {
        handlerStore.setRedirect(error.response.data.redirect);
      }

      return Promise.reject(error);
    },
  );

  return {
    provide: {
      axios: api,
    },
  };
});
