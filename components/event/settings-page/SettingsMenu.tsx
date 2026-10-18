"use client";

import type { ResolvedTheme } from "@/lib/theme";
import type { SettingsSection } from "./types";

export function SettingsMenu({
  isOwner,
  openSection,
  t,
  emailEnabled = true,
}: {
  isOwner: boolean;
  openSection: (section: SettingsSection) => void;
  t: ResolvedTheme;
  emailEnabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {(
        [
          {
            id: "hosts" as const,
            title: "👥 Organisatoren en mede-organisatoren",
            desc: isOwner
              ? "Beheer wie dit evenement kan bewerken"
              : "Bekijk de organisatoren en beheer je mede-organisatorprofiel",
          },
          {
            id: "privacy",
            title: "🔒 Weergaveopties",
            desc: "Toegang tot de gastenlijst, weergave van aanmeldingen en privacy van het evenement",
          },
          {
            id: "rsvp",
            title: "✉️ Aanmeldopties",
            desc: "Instellingen voor extra gasten, goedkeuring van aanmeldingen en de misschien-optie",
          },
          { id: "theme", title: "🎨 Thema", desc: "Wijzig het basisthema en de accentkleur" },
          {
            id: "reminders",
            title: "🔔 Automatische herinneringen",
            desc: "Stel automatische e-mails en sms-berichten in voor en na het evenement",
          },
          ...(emailEnabled
            ? [
                {
                  id: "emails" as const,
                  title: "💌 E-mails",
                  desc: "Bekijk de e-mails voor dit evenement en stuur jezelf een test",
                },
              ]
            : []),
          { id: "polls", title: "📊 Peilingen", desc: "Maak peilingen voor gasten en beheer ze" },
          {
            id: "questionnaire",
            title: "📋 Vragenlijst",
            desc: "Stel gasten aangepaste vragen tijdens hun aanmelding",
          },
          {
            id: "potluck",
            title: "🍽️ Meeneemlijst",
            desc: "Beheer wat gasten kunnen toezeggen om mee te nemen",
          },
        ] as {
          id: SettingsSection;
          title: string;
          desc: string;
        }[]
      ).map((sec) => (
        <button
          key={sec.id}
          onClick={() => openSection(sec.id)}
          style={{
            textAlign: "left",
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: t.cardRadius,
            padding: "20px",
            boxShadow: t.cardShadow,
            backdropFilter: "blur(12px)",
            cursor: "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            transition: "all 0.15s ease-in-out",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: t.textPrimary,
                margin: "0 0 4px",
              }}
            >
              {sec.title}
            </h3>
            <p style={{ fontSize: "13px", color: t.textMuted, margin: 0 }}>{sec.desc}</p>
          </div>
          <span style={{ fontSize: "18px", color: t.textMuted }}>➔</span>
        </button>
      ))}
    </div>
  );
}
