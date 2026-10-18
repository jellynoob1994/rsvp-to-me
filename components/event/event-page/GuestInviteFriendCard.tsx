"use client";

import { Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { inviteFriendAsGuest } from "@/app/actions/event";
import type { ResolvedTheme } from "@/lib/theme";
import { EventCard } from "./EventCard";
import { useCaptcha } from "@/components/ui/CaptchaProvider";

export function GuestInviteFriendCard({
  eventId,
  guestToken,
  theme: t,
}: {
  eventId: string;
  guestToken: string;
  theme: ResolvedTheme;
}) {
  const [target, setTarget] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { runWithCaptcha } = useCaptcha();

  const handleSend = () => {
    const val = target.trim();
    if (!val) return;
    setStatus("idle");
    setErrorMsg("");
    startTransition(async () => {
      try {
        const res = await runWithCaptcha("guest_invite", (token) =>
          inviteFriendAsGuest(eventId, guestToken, val, token)
        );
        if (res.success) {
          setStatus("success");
          setTarget("");
          return;
        }
        setStatus("error");
        setErrorMsg(res.error ?? "Uitnodiging versturen is mislukt");
      } catch (reason) {
        setStatus("error");
        setErrorMsg(reason instanceof Error ? reason.message : "Beveiligingscontrole mislukt");
      }
    });
  };

  return (
    <EventCard theme={t}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
        <Mail size={16} style={{ color: t.accent }} />
        <span
          style={{
            fontWeight: 700,
            fontSize: "14.5px",
            color: t.textPrimary,
          }}
        >
          Nodig een vriend uit
        </span>
      </div>
      <p style={{ fontSize: "13px", color: t.textSecondary, margin: "0 0 12px", lineHeight: 1.4 }}>
        Dit evenement is privé. Nodig vrienden uit door hieronder hun e-mailadres of telefoonnummer
        in te vullen:
      </p>
      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
        <input
          style={{
            flex: 1,
            padding: "10px 14px",
            background: t.inputBg,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: t.btnRadius,
            color: t.textPrimary,
            fontFamily: "inherit",
            fontSize: "13.5px",
            outline: "none",
            boxSizing: "border-box",
          }}
          placeholder="E-mailadres of telefoonnummer"
          value={target}
          disabled={isPending}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && target.trim() && !isPending) handleSend();
          }}
        />
        <button
          onClick={handleSend}
          disabled={!target.trim() || isPending}
          style={{
            padding: "10px 18px",
            background: t.accent,
            color: t.accentFg,
            border: "none",
            borderRadius: t.btnRadius,
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: 700,
            cursor: !target.trim() || isPending ? "not-allowed" : "pointer",
            opacity: !target.trim() || isPending ? 0.6 : 1,
            boxShadow: t.accentShadow,
            whiteSpace: "nowrap",
          }}
        >
          {isPending ? "Bezig met verzenden…" : "Versturen"}
        </button>
      </div>
      {status === "success" && (
        <div style={{ fontSize: "12.5px", color: "#4ade80", fontWeight: 600, marginTop: "8px" }}>
          ✓ De uitnodiging is succesvol verstuurd!
        </div>
      )}
      {status === "error" && (
        <div style={{ fontSize: "12.5px", color: "#f87171", fontWeight: 600, marginTop: "8px" }}>
          ✕ {errorMsg}
        </div>
      )}
    </EventCard>
  );
}
