import axios from "axios";

const mockClient = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
});

mockClient.interceptors.request.use(async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return config;
});

export default mockClient;
