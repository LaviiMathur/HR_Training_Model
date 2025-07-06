
import { useEffect } from "react";
import axios from "axios";

export default function useTokenRefresher() {
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });
        console.log("🔄 Token refreshed");
      } catch (err) {
        console.error("❌ Token refresh failed:", err.message);
      }
    };

    const interval = setInterval(refreshToken, 15 * 60 * 1000);
    refreshToken();

    return () => clearInterval(interval);
  }, []);
}
