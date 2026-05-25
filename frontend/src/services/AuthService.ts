import axios from "axios";

// Backend Base URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

const AuthService = {
  /*
  ========================================
  REGISTER
  ========================================
  */

  register: async (userData: RegisterData) => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("✅ Register Response:", response.data);

      // Store Token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Store User
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ Registration Error:", error);
      throw error;
    }
  },

  /*
  ========================================
  LOGIN
  ========================================
  */

  login: async (userData: LoginData) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("✅ Login Response:", response.data);

      // Store Token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Store User
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ Login Error:", error);
      throw error;
    }
  },

  /*
  ========================================
  LOGOUT
  ========================================
  */

  logout: async () => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("❌ Logout Error:", error);
      throw error;
    }
  },

  /*
  ========================================
  GET TOKEN
  ========================================
  */

  getToken: () => {
    return localStorage.getItem("token");
  },

  /*
  ========================================
  CHECK AUTH
  ========================================
  */

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default AuthService;