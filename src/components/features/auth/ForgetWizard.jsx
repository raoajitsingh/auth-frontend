import { useState } from "react";
import { AuthAPI } from "../../../lib/api";
import Input, { Label } from "../../ui/Input";
import OtpInput from "../../ui/OtpInput";
import Button from "../../ui/Button";
import Turnstile from "../../Turnstile";
import Honeypot from "../../ui/Honeypot";

export default function ForgotWizard({ onSuccessMsg, onError, onFinished }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("request"); // request | otp | password
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
      const r = await AuthAPI.forgotPassword(email, cfToken);
      setStep("otp");
      setOtpStatus(null);
      setCfToken("");
      onSuccessMsg?.(r.data.message || `OTP sent to ${email}`);
    } catch (e) {
      onError?.(e?.response?.data?.error || "Failed to send reset OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      await AuthAPI.verifyResetOtp(email, otp);
      setOtpStatus("ok");
      onSuccessMsg?.("OTP verified. Set a new password.");
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

  async function resetPassword() {
    if (!password || !cfToken) return;
    setLoading(true);
    try {
      await AuthAPI.resetPassword(email, password, cfToken);
      onSuccessMsg?.("Password reset successful. You can login now.");
      // reset internal state
      setEmail("");
      setPassword("");
      setOtp("");
      setCfToken("");
      setStep("request");
      onFinished?.(); // switch to Login tab
    } catch (e) {
      onError?.(e?.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 animate-slide-up" key={`forgot-${step}`}>
      {step === "request" && (
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

          <Turnstile onToken={setCfToken} />
          <Button
            variant="ghost"
            disabled={!email || !cfToken || loading}
            type="submit"
          >
            {loading ? "Sending..." : "Send reset OTP"}
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
                  await AuthAPI.forgotPassword(email);
                  setOtpStatus(null);
                  onSuccessMsg?.(`OTP resent to ${email}`);
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
          <Label>New password</Label>
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
            onClick={resetPassword}
          >
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </>
      )}
    </div>
  );
}
