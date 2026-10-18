import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createEvent } from "@/app/actions/createEvent";
import LocationSelector from "@/components/event/LocationSelector";
import { APP_SHELL } from "@/lib/theme";
import { getSessionUser } from "@/lib/session-user";
import {
  AppButton,
  AppCard,
  AppInput,
  FormField,
  appInputStyle,
} from "@/components/ui/AppPrimitives";
import { CaptchaForm } from "@/components/ui/CaptchaForm";

export const metadata: Metadata = { title: "Nieuw evenement" };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AppCard
      style={{
        padding: "20px",
        marginBottom: "14px",
      }}
    >
      <h2
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: APP_SHELL.textMuted,
          textTransform: "none",
          letterSpacing: "0.02em",
          marginBottom: "16px",
        }}
      >
        {title}
      </h2>
      {children}
    </AppCard>
  );
}

export default async function NewEventPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role === "GUEST") redirect("/auth/sign-in");

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 16px 80px" }}>
      <CaptchaForm action={createEvent} captchaAction="event_create">
        <Card title="Evenementgegevens">
          <FormField label="Naam van het evenement *" style={{ marginBottom: "14px" }}>
            <AppInput name="title" required placeholder="Wijnavond bij Jan" />
          </FormField>
          <FormField label="Beschrijving" style={{ marginBottom: "14px" }}>
            <textarea
              name="description"
              placeholder="Kom gezellig langs! Neem iets mee om te delen."
              rows={3}
              style={{ ...appInputStyle, resize: "vertical" }}
            />
          </FormField>
        </Card>

        <Card title="Datum en tijd">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="Datum *" style={{ marginBottom: "14px" }}>
              <AppInput name="startDate" type="date" required />
            </FormField>
            <FormField label="Tijd *" style={{ marginBottom: "14px" }}>
              <AppInput name="startTime" type="time" required />
            </FormField>
          </div>
          <FormField label="Tijdzone" style={{ marginBottom: "14px" }}>
            <select name="timezone" defaultValue="Europe/Amsterdam" style={appInputStyle}>
              <option value="Europe/Amsterdam">Nederland (CET/CEST)</option>
              <option value="America/New_York">Oost-Amerikaanse tijd (ET)</option>
              <option value="America/Chicago">Centraal-Amerikaanse tijd (CT)</option>
              <option value="America/Denver">Bergtijd (MT)</option>
              <option value="America/Los_Angeles">Pacifische tijd (PT)</option>
              <option value="America/Anchorage">Alaskatijd (AKT)</option>
              <option value="Pacific/Honolulu">Hawaïaanse tijd (HST)</option>
              <option value="Europe/London">Londen (GMT/BST)</option>
              <option value="Europe/Paris">Parijs (CET/CEST)</option>
              <option value="Asia/Tokyo">Tokio (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
            </select>
          </FormField>
        </Card>

        <Card title="Locatie">
          <LocationSelector />
        </Card>

        <Card title="Zichtbaarheid">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(
              [
                ["UNLISTED", "Niet vermeld", "Alleen mensen met de link kunnen dit evenement bekijken"],
                ["PUBLIC", "Openbaar", "Iedereen kan dit evenement vinden en bekijken"],
                ["PRIVATE", "Privé", "Alleen op uitnodiging — de organisator moet elke aanmelding goedkeuren"],
              ] as const
            ).map(([val, label, desc]) => (
              <label
                key={val}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px",
                  background: APP_SHELL.cardBg,
                  border: `1px solid ${APP_SHELL.cardBorder}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={val}
                  defaultChecked={val === "UNLISTED"}
                  style={{ marginTop: "2px", accentColor: APP_SHELL.accent }}
                />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: APP_SHELL.textPrimary }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "12px", color: APP_SHELL.textMuted, marginTop: "2px" }}>
                    {desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <AppButton
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
          }}
        >
          Evenement aanmaken →
        </AppButton>
      </CaptchaForm>
    </div>
  );
}
