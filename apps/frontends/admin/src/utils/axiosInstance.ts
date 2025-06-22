import { config } from "@/configs/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${config.apiUrl}/api/v1`,
  timeout: 5000,
  withCredentials: true
});

export default axiosInstance;
