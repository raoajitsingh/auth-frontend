import axios from "axios";

// Backend origin from env; default to local for dev
const ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, ""); // trim trailing slash

export const api = axios.create({
  baseURL: `${ORIGIN}/api`,
  withCredentials: true,
  headers: { "content-type": "application/json" },
});

export const AuthAPI = {
  startRegister: (email) => api.post(`/auth/start-register`, { email }),
  verifyOtp: (email, code) => api.post(`/auth/verify-otp`, { email, code }),
  completeRegister: (email, password, token) =>
    api.post(`/auth/complete-register`, {
      email,
      password,
      cf_turnstile_token: token,
    }),

  login: (email, password, token) =>
    api.post(`/auth/login`, { email, password, cf_turnstile_token: token }),

  forgotPassword: (email, token) =>
    api.post(`/auth/forgot-password`, { email, cf_turnstile_token: token }),

  verifyResetOtp: (email, code) =>
    api.post(`/auth/verify-reset-otp`, { email, code }),

  resetPassword: (email, password, token) =>
    api.post(`/auth/reset-password`, {
      email,
      password,
      cf_turnstile_token: token,
    }),
};
