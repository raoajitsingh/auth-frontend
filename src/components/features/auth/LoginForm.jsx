import { useState } from "react";
import { AuthAPI } from "../../../lib/api";
import Input, { Label } from "../../ui/Input";

import Button from "../../ui/Button";
import Turnstile from "../../Turnstile";
import Honeypot from "../../ui/Honeypot";

export default function LoginForm({ onSuccess, onError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfToken, setCfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [badCreds, setBadCreds] = useState(false);

  // --- Bot-catch extras ---
  const [hp, setHp] = useState(""); // honeypot
  const [formShownAt] = useState(() => Date.now()); // human-time guard
  const tooFast = () => Date.now() - formShownAt < 1500; // 1.5s min

  async function login() {
    // block obvious bots
    if (hp) {
      onError?.("Bot detected");
      return;
    }
    if (tooFast()) {
      onError?.("Please try again.");
      return;
    }

    setLoading(true);
    try {
      const r = await AuthAPI.login(email, password, cfToken);
      localStorage.setItem("token", r.data.token);
      setBadCreds(false);
      onSuccess(email);
    } catch (e) {
      if (e?.response?.status === 401) {
        setBadCreds(true);
      } else if (e?.response?.status === 403) {
        onError("Please complete registration first.");
      } else {
        onError(e?.response?.data?.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    login();
  }

  return (
    <form className="space-y-4 animate-slide-up" onSubmit={handleSubmit}>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {badCreds && (
          <p className="text-rose-300 text-xs mt-1">
            Email or password is incorrect.
          </p>
        )}
      </div>

      {/* Honeypot (hidden) */}
      <Honeypot value={hp} setValue={setHp} />

      <Turnstile onToken={setCfToken} />

      <Button
        type="submit"
        disabled={!email || !password || !cfToken || loading}
      >
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
