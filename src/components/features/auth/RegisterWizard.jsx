import { useState } from "react";
import { AuthAPI } from "../../../lib/api";

import Input, { Label } from "../../ui/Input";
import OtpInput from "../../ui/OtpInput";
import Button from "../../ui/Button";
import Turnstile from "../../Turnstile";
import Honeypot from "../../ui/Honeypot";

export default function RegisterWizard({
  onSuccess,
  onInfo,
  onSuccessMsg,
  onError,
}) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // email | otp | password
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(null);
  const [password, setPassword] = useState("");
  const [cfToken, setCfToken] = useState("");
  const [loading, setLoading] = useState(false);

  // bot-catch
  const [hp, setHp] = useState("");
  const [formShownAt] = useState(() => Date.now());
  const tooFast = () => Date.now() - formShownAt < 1500;

  async function sendOtp() {
    if (hp) return onError?.("Bot detected");
    if (tooFast()) return onError?.("Please try again.");
    setLoading(true);
    try {
      const r = await AuthAPI.startRegister(email);
      onSuccessMsg?.(r.data.message || `OTP sent to ${email}`);
      setStep("otp");
      setOtpStatus(null);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409)
        onInfo?.("Email already registered. Try Login or Forgot password.");
      else onError?.(e?.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      await AuthAPI.verifyOtp(email, otp);
      setOtpStatus("ok");
      setTimeout(() => {
        setStep("password");
        setOtp("");
        setOtpStatus(null);
      }, 500);
    } catch {
      setOtpStatus("bad");
    } finally {
      setLoading(false);
    }
  }

  async function complete() {
    if (!password || !cfToken) return;
    setLoading(true);
    try {
      const r = await AuthAPI.completeRegister(email, password, cfToken);
      localStorage.setItem("token", r.data.token);
      onSuccess?.(email);
      // reset internal state
      setEmail("");
      setPassword("");
      setOtp("");
      setCfToken("");
      setStep("email");
    } catch (e) {
      onError?.(e?.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 animate-slide-up" key={`reg-${step}`}>
      {step === "email" && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendOtp();
          }}
        >
          <Label>Email</Label>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Honeypot */}
          <Honeypot value={hp} setValue={setHp} />
          <Button variant="success" disabled={!email || loading} type="submit">
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <>
          <Label>Enter OTP</Label>
          <OtpInput
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setOtpStatus(null);
            }}
            status={otpStatus}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={loading}
              onClick={async () => {
                try {
                  const r = await AuthAPI.startRegister(email);
                  onSuccessMsg?.(r.data.message || `OTP resent to ${email}`);
                  setOtpStatus(null);
                } catch (e) {
                  onError?.(e?.response?.data?.error || "Failed to resend");
                }
              }}
            >
              Resend
            </Button>
            <Button
              variant="success"
              disabled={!otp || loading}
              onClick={verifyOtp}
            >
              {loading ? "Checking..." : "Verify"}
            </Button>
          </div>
        </>
      )}

      {step === "password" && (
        <>
          <Label>Create password</Label>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ul className="text-xs text-white/70 space-y-1">
            <li>• At least 8 characters</li>
            <li>• 1 uppercase, 1 lowercase, 1 number</li>
            <li>• 1 special character</li>
          </ul>
          <Turnstile onToken={setCfToken} />
          <Button
            disabled={!password || !cfToken || loading}
            onClick={complete}
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
        </>
      )}
    </div>
  );
}
