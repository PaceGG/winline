import { type AxiosInstance } from "axios";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

let httpClient: AxiosInstance;

if (USE_MOCK_API) {
  httpClient = (await import("./mockClient")).default;
} else {
  httpClient = (await import("./realClient")).default;
}

export { httpClient };
