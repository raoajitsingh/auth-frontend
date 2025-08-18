import { useState, useEffect } from "react";

import Card from "../../ui/Card";

import Tabs from "../../ui/Tabs";
import Notice from "../../ui/Notice";
import Modal from "../../Modal";
import RegisterWizard from "./RegisterWizard";

import LoginForm from "./LoginForm";
import ForgotWizard from "./ForgetWizard";

export default function AuthPage() {
  const [tab, setTab] = useState("register"); // register | login | forgot
  const [notice, setNotice] = useState(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [emailForWelcome, setEmailForWelcome] = useState("");

  // auto-clear notice
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  function handleTabChange(next) {
    setTab(next);
    setNotice(null); //clears any message immediately on changing tab
  }

  return (
    <>
      <Card>
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Welcome
          </h1>
          <p className="text-sm text-white/70">
            Create an account or sign in to continue
          </p>
        </div>

        {notice && (
          <div className="mb-3">
            <Notice kind={notice.kind} onClose={() => setNotice(null)}>
              {notice.text}
            </Notice>
          </div>
        )}

        <Tabs
          value={tab}
          onChange={handleTabChange}
          items={["register", "login", "forgot"]}
        />

        {tab === "register" && (
          <RegisterWizard
            onSuccess={(email) => {
              setEmailForWelcome(email);
              setWelcomeOpen(true);
              setTab("login");
            }}
            onInfo={(text) => setNotice({ kind: "info", text })}
            onSuccessMsg={(text) => setNotice({ kind: "success", text })}
            onError={(text) => setNotice({ kind: "error", text })}
          />
        )}

        {tab === "login" && (
          <LoginForm
            onSuccess={(email) => {
              setEmailForWelcome(email);
              setWelcomeOpen(true);
            }}
            onError={(text) => setNotice({ kind: "error", text })}
          />
        )}

        {tab === "forgot" && (
          <ForgotWizard
            onSuccessMsg={(text) => setNotice({ kind: "success", text })}
            onError={(text) => setNotice({ kind: "error", text })}
            onFinished={() => setTab("login")} // go to login after reset
          />
        )}
      </Card>

      <Modal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        title="Welcome 👋"
      >
        <p className="text-white/90">
          Hello <b>{emailForWelcome || "there"}</b> — you’re in!
        </p>
      </Modal>
    </>
  );
}
