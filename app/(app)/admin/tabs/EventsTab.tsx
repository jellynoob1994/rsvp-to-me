"use client";

import { APP_SHELL } from "@/lib/theme";
import { AppInput, appCardStyle } from "@/components/ui/AppPrimitives";
import type { AdminEvent } from "./types";

export function EventsTab({
  eventSearch,
  handleEventSearch,
  events,
  handleEventDelete,
}: {
  eventSearch: string;
  handleEventSearch: (val: string) => Promise<void>;
  events: AdminEvent[];
  handleEventDelete: (eventId: string, title: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <AppInput
        type="text"
        placeholder="Zoek evenementen op titel, slug of organisator..."
        value={eventSearch}
        onChange={(e) => handleEventSearch(e.target.value)}
        style={{ padding: "12px 16px" }}
      />

      <div
        style={{
          ...appCardStyle,
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: "700px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${APP_SHELL.navBorder}`,
                  color: APP_SHELL.textSecondary,
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "16px" }}>Evenementinformatie</th>
                <th style={{ padding: "16px" }}>Organisator</th>
                <th style={{ padding: "16px" }}>Statistieken</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Acties</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: APP_SHELL.textMuted,
                    }}
                  >
                    Geen evenementen gevonden.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${APP_SHELL.navBorder}` }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: 700, color: APP_SHELL.textPrimary }}>{e.title}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: APP_SHELL.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        Datum: {new Date(e.startAt).toLocaleString("nl-NL")} · status: {e.status}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: APP_SHELL.textPrimary }}>{e.hostName}</div>
                      <div style={{ fontSize: "12px", color: APP_SHELL.textSecondary }}>
                        {e.hostEmail}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: APP_SHELL.textPrimary }}>{e.rsvpCount} aanmeldingen</div>
                      <span
                        style={{
                          fontSize: "10px",
                          color: APP_SHELL.textSecondary,
                          textTransform: "uppercase",
                        }}
                      >
                        {e.visibility === "PUBLIC" ? "Openbaar" : e.visibility === "UNLISTED" ? "Niet vermeld" : "Privé"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <a
                        href={`/e/${e.slug}?admin=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: APP_SHELL.accent,
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: "13px",
                          marginRight: "16px",
                        }}
                      >
                        Modereren
                      </a>
                      <button
                        onClick={() => handleEventDelete(e.id, e.title)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        Verwijderen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
