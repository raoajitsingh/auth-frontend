import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

export const AuthAPI = {
  startRegister: (email) => api.post("/auth/start-register", { email }),
  verifyOtp: (email, code) => api.post("/auth/verify-otp", { email, code }),
  completeRegister: (email, password, token) =>
    api.post("/auth/complete-register", {
      email,
      password,
      cf_turnstile_token: token,
    }),

  login: (email, password, token) =>
    api.post("/auth/login", { email, password, cf_turnstile_token: token }),

  forgotPassword: (email, token) =>
    api.post("/auth/forgot-password", { email, cf_turnstile_token: token }),
  verifyResetOtp: (email, code) =>
    api.post("/auth/verify-reset-otp", { email, code }),
  resetPassword: (email, password, token) =>
    api.post("/auth/reset-password", {
      email,
      password,
      cf_turnstile_token: token,
    }),
};
